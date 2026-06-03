import argparse
import json
import os
import sys

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


class ChannelAttention(layers.Layer):
    def __init__(self, reduction_ratio=16, **kwargs):
        super().__init__(**kwargs)
        self.reduction_ratio = reduction_ratio

    def build(self, input_shape):
        channels = input_shape[-1]
        reduced = max(1, channels // self.reduction_ratio)
        self.gap = layers.GlobalAveragePooling2D()
        self.fc1 = layers.Dense(reduced, activation="relu")
        self.fc2 = layers.Dense(channels, activation="sigmoid")
        self.reshape = layers.Reshape((1, 1, channels))
        super().build(input_shape)

    def call(self, inputs):
        x = self.gap(inputs)
        x = self.fc1(x)
        x = self.fc2(x)
        x = self.reshape(x)
        return inputs * x

    def get_config(self):
        config = super().get_config()
        config.update({"reduction_ratio": self.reduction_ratio})
        return config


class FocalLoss(keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, name="focal_loss", **kwargs):
        super().__init__(name=name, **kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_one_hot = tf.cast(y_true, tf.float32)
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        cross_ent = -y_one_hot * tf.math.log(y_pred)
        p_t = tf.reduce_sum(y_one_hot * y_pred, axis=-1)
        focal_w = self.alpha * tf.pow(1.0 - p_t, self.gamma)
        return tf.reduce_mean(focal_w * tf.reduce_sum(cross_ent, axis=-1))

    def get_config(self):
        config = super().get_config()
        config.update({"gamma": self.gamma, "alpha": self.alpha})
        return config


def preprocess_image(image_path, img_size):
    img = tf.io.read_file(image_path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.resize(img, tuple(img_size))
    img = tf.cast(img, tf.float32)

    # Sesuai training di FitSmart_AI_Model:
    # train_ds dan val_ds memakai normalisasi pixel 0..255 menjadi 0..1
    img = img / 255.0

    return tf.expand_dims(img, axis=0)


def get_class_names(mapping):
    if "class_names" in mapping:
        return mapping["class_names"]

    idx2cls = mapping.get("idx2cls", {})
    return [
        idx2cls[str(i)]
        for i in range(len(idx2cls))
    ]


def predict_food(model_path, mapping_path, image_path, top_k):
    with open(mapping_path, encoding="utf-8") as f:
        mapping = json.load(f)

    model = keras.models.load_model(
        model_path,
        custom_objects={
            "ChannelAttention": ChannelAttention,
            "FocalLoss": FocalLoss,
        },
        compile=False,
    )

    img_size = mapping.get("img_size", [224, 224])
    class_names = get_class_names(mapping)
    nutrition_map = mapping.get("nutrition", {}) or {}

    img = preprocess_image(image_path, img_size)
    probs = model(img, training=False).numpy()[0]

    top_idxs = np.argsort(probs)[::-1][:top_k]

    results = []
    for idx in top_idxs:
        idx = int(idx)

        if idx < len(class_names):
            label = class_names[idx]
        else:
            label = str(idx)

        confidence = float(probs[idx])

        results.append({
            "label": label,
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2),
            "nutrition": nutrition_map.get(label, {}) or {},
        })

    return {
        "predicted_class": results[0]["label"] if results else None,
        "confidence": results[0]["confidence"] if results else 0,
        "confidence_percent": results[0]["confidence_percent"] if results else 0,
        "top_predictions": results,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--mapping", required=True)
    parser.add_argument("--image", required=True)
    parser.add_argument("--top-k", type=int, default=5)
    args = parser.parse_args()

    result = predict_food(
        args.model,
        args.mapping,
        args.image,
        args.top_k,
    )

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)