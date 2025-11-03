import prisma from "../lib/prisma";

async function getCategoryTypeId(typeName: "TASK_KIND" | "TASK_TYPE" | "TASK_COLLECTION"): Promise<number> {
   const categoryType = await prisma.categoryType.findUnique({
      where: { name: typeName },
      select: { id: true },
   });
   if (!categoryType) {
      throw new Error(`CategoryType: ${typeName} belum di-seed.`);
   }
   return categoryType.id;
}

export const CategoryService = {
   async getAll(categoryTypeName: string, userId: string) {
      const typeId = await getCategoryTypeId(categoryTypeName as any);

      const categories = await prisma.category.findMany({
         where: {
            typeId: typeId,
            OR: [{ userId: null }, { userId: userId }],
         },
         orderBy: { title: "asc" },
      });

      return categories;
   },

   async create(categoryTypeName: string, userId: string, title: string) {
      const typeId = await getCategoryTypeId(categoryTypeName as any);

      const newCategory = await prisma.category.create({
         data: {
            title: title,
            typeId: typeId,
            userId: userId,
         },
      });
      return newCategory;
   },

   async update(id: string, userId: string, newTitle: string) {
      const existingCategory = await prisma.category.findUnique({
         where: { id: id },
      });

      if (!existingCategory) {
         throw new Error("Category tidak ditemukan.");
      }

      if (existingCategory.userId !== userId) {
         throw new Error("Anda hanya dapat mengubah Category custom milik Anda.");
      }

      return prisma.category.update({
         where: { id: id },
         data: { title: newTitle },
      });
   },

   async delete(id: string, userId: string) {
      const existingCategory = await prisma.category.findUnique({
         where: { id: id },
      });

      if (!existingCategory) {
         throw new Error("Category tidak ditemukan.");
      }

      if (existingCategory.userId !== userId) {
         throw new Error("Anda hanya dapat menghapus Category custom milik Anda.");
      }

      await prisma.category.delete({ where: { id: id } });
      return { message: "Category berhasil dihapus." };
   },
};
