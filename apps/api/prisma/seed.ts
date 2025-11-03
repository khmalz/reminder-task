import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const staticCategoryTypes = [{ name: "TASK_KIND" }, { name: "TASK_TYPE" }, { name: "TASK_COLLECTION" }];

async function main() {
   console.log("Start seeding static CategoryTypes...");
   for (const typeData of staticCategoryTypes) {
      const type = await prisma.categoryType.upsert({
         where: { name: typeData.name },
         update: {},
         create: typeData,
      });
      console.log(`Created or updated CategoryType with ID: ${type.id} and Name: ${type.name}`);
   }
   console.log("Seeding finished.");
}

main()
   .catch(e => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
