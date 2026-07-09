import { seedDatabase } from "../src/server/backend";
import { prisma } from "../src/server/prisma";

async function main() {
  const result = await seedDatabase();
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
