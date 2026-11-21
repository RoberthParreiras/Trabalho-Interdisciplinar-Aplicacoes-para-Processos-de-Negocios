import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/infra/db/prisma.js"; // Ajuste para default import se necessário

async function main() {
  const usuarioAdmin = process.env.ADMIN_USER || "admin";
  const senhaPlana = process.env.ADMIN_PASSWORD || "admin123";

  const senhaHash = await bcrypt.hash(senhaPlana, 10);

  // upsert evita erro caso você rode o script mais de uma vez
  const admin = await prisma.usuario.upsert({
    where: { usuario: usuarioAdmin },
    update: {},
    create: {
      nome: "admin",
      usuario: usuarioAdmin,
      senha: senhaHash,
    },
  });

  console.log("Usuário admin pronto:", {
    id: admin.id,
    usuario: admin.usuario,
  });
}

main()
  .catch((err) => {
    console.error("Erro ao criar usuário admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0); // Forces Node to exit cleanly
  });
