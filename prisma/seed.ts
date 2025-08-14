import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const service1 = await prisma.service.upsert({
    where: { id: 1 },
    update: {
      nom: "Consultation générale",
      description: "Service de consultation médicale générale",
    },
    create: {
      nom: "Consultation générale",
      description: "Service de consultation médicale générale",
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 2 },
    update: {
      nom: "Consultation spécialisée",
      description: "Service de consultation spécialisée",
    },
    create: {
      nom: "Consultation spécialisée",
      description: "Service de consultation spécialisée",
    },
  });

  console.log("Services créés ou existants :", service1, service2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
