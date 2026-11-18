const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const BCRYPT_ROUNDS = 12;

// Hash palsu dipakai agar waktu respons login tetap sama baik email terdaftar
// maupun tidak (mencegah user enumeration lewat timing attack).
const DUMMY_HASH = bcrypt.hashSync("fitsmart-dummy-password", BCRYPT_ROUNDS);

// Jangan pernah mengirim hash password ke klien.
const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const findByEmail = (email) =>
  prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

exports.toPublicUser = toPublicUser;

exports.register = async (data) => {
  const { name, email, password } = data;

  const existing = await findByEmail(email);
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  return toPublicUser(user);
};

exports.login = async (data) => {
  const { email, password } = data;

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const user = await findByEmail(email);

  // Selalu jalankan bcrypt.compare, walau user tidak ditemukan.
  const match = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
  if (!user || !match) throw new Error("Invalid credentials");
  if (user.isActive === false) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user: toPublicUser(user), token };
};
