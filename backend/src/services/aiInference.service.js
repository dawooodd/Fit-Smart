const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendRoot = process.cwd();
const defaultModelPath = path.join(backendRoot, 'ai-model', 'model', 'fitsmart_model.keras');
const defaultMappingPath = path.join(backendRoot, 'ai-model', 'model', 'class_mapping.json');
const defaultScriptPath = path.join(backendRoot, 'ai-model', 'inference.py');

function resolvePath(value, fallback) {
  const raw = value || fallback;
  return path.isAbsolute(raw) ? raw : path.resolve(backendRoot, raw);
}

function isModelReady() {
  const modelPath = resolvePath(process.env.FITSMART_MODEL_PATH, defaultModelPath);
  const mappingPath = resolvePath(process.env.FITSMART_MAPPING_PATH, defaultMappingPath);
  const scriptPath = resolvePath(process.env.FITSMART_INFERENCE_SCRIPT, defaultScriptPath);
  const allowDemo = String(process.env.FITSMART_ALLOW_DEMO_AI || '').toLowerCase() === 'true';
  return fs.existsSync(scriptPath) && fs.existsSync(mappingPath) && (fs.existsSync(modelPath) || allowDemo);
}

function getModelStatus() {
  const modelPath = resolvePath(process.env.FITSMART_MODEL_PATH, defaultModelPath);
  const mappingPath = resolvePath(process.env.FITSMART_MAPPING_PATH, defaultMappingPath);
  const scriptPath = resolvePath(process.env.FITSMART_INFERENCE_SCRIPT, defaultScriptPath);
  const allowDemo = String(process.env.FITSMART_ALLOW_DEMO_AI || '').toLowerCase() === 'true';
  return {
    ready: fs.existsSync(scriptPath) && fs.existsSync(mappingPath) && (fs.existsSync(modelPath) || allowDemo),
    mode: fs.existsSync(modelPath) ? 'tensorflow' : allowDemo ? 'demo' : 'missing-model',
    modelPath,
    mappingPath,
    scriptPath,
    hasModel: fs.existsSync(modelPath),
    hasMapping: fs.existsSync(mappingPath),
    hasScript: fs.existsSync(scriptPath),
  };
}

function mapPredictionToAnalysis(result) {
  const top = result.top_predictions || [];
  const best = top[0] || {};
  const nutrition = best.nutrition || {};

  return {
    detectedFoods: top.map((item) => ({
      label: item.label,
      confidence: item.confidence,
      nutrition: item.nutrition || {},
    })),
    estimatedCalories: Math.round(Number(nutrition.calories || nutrition.kalori || nutrition.energy_kcal || 0)) || null,
    estimatedProtein: Number(nutrition.protein || nutrition.protein_g || 0) || null,
    estimatedCarbs: Number(nutrition.carbs || nutrition.carbohydrate || nutrition.karbohidrat || 0) || null,
    estimatedFat: Number(nutrition.fat || nutrition.lemak || 0) || null,
    confidenceScore: best.confidence !== undefined ? Math.round(Number(best.confidence) * 10000) / 100 : null,
    aiResponse: {
      provider: 'FitSmart TensorFlow model',
      predictedClass: result.predicted_class,
      confidence: result.confidence,
      topPredictions: top,
      raw: result,
    },
    status: 'completed',
  };
}

function predictFood(imagePath) {
  return new Promise((resolve, reject) => {
    const modelPath = resolvePath(process.env.FITSMART_MODEL_PATH, defaultModelPath);
    const mappingPath = resolvePath(process.env.FITSMART_MAPPING_PATH, defaultMappingPath);
    const scriptPath = resolvePath(process.env.FITSMART_INFERENCE_SCRIPT, defaultScriptPath);
    const pythonBin = process.env.PYTHON_BIN || 'python3';

    if (!isModelReady()) {
      const status = getModelStatus();
      return reject(new Error(`AI model belum siap. Status: ${JSON.stringify(status)}`));
    }

    const child = spawn(pythonBin, [scriptPath, '--model', modelPath, '--mapping', mappingPath, '--image', imagePath, '--top-k', '3'], {
      cwd: backendRoot,
      env: process.env,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(stderr || `AI inference failed with exit code ${code}`));
      try {
        resolve(mapPredictionToAnalysis(JSON.parse(stdout)));
      } catch (error) {
        reject(new Error(`Gagal membaca output AI: ${error.message}`));
      }
    });
  });
}

module.exports = { isModelReady, getModelStatus, predictFood };
