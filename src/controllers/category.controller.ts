import { Request, Response, Router } from "express";
import { CategoryService } from "../services/category.service";
import { AuthMiddleware } from "../middleware/auth.middleware";

interface AuthenticatedRequest extends Request {
   user?: {
      id: string;
      email: string;
   };
   query: {
      type?: string;
   };
}

const CategoryRouter = Router();

CategoryRouter.use(AuthMiddleware);

const validCategoryTypes = ["TASK_KIND", "TASK_TYPE", "TASK_COLLECTION"];

CategoryRouter.get("/", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   const categoryType = req.query.type?.toUpperCase();

   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });
   if (!categoryType || !validCategoryTypes.includes(categoryType)) {
      return res.status(400).json({ error: 'Query parameter "type" wajib dan harus valid (TASK_KIND, TASK_TYPE, COLLECTION).' });
   }

   try {
      const categories = await CategoryService.getAll(categoryType, userId);
      return res.status(200).json(categories);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Gagal mengambil category." });
   }
});

CategoryRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   const categoryType = req.query.type?.toUpperCase();
   const { title } = req.body;

   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });
   if (!categoryType || !validCategoryTypes.includes(categoryType)) {
      return res.status(400).json({ error: 'Query parameter "type" wajib dan harus valid.' });
   }
   if (!title || typeof title !== "string") {
      return res.status(400).json({ error: 'Body field "title" wajib diisi.' });
   }

   try {
      const newCategory = await CategoryService.create(categoryType, userId, title);
      return res.status(201).json(newCategory);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Gagal membuat Category custom." });
   }
});

CategoryRouter.put("/:id", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   const { title } = req.body;

   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });
   if (!title || typeof title !== "string") {
      return res.status(400).json({ error: 'Body field "title" wajib diisi.' });
   }

   try {
      const updatedCategory = await CategoryService.update(req.params.id, userId, title);
      return res.status(200).json(updatedCategory);
   } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("mengubah Category")) {
         return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: "Gagal memperbarui Category." });
   }
});

CategoryRouter.delete("/:id", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;

   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });

   try {
      const result = await CategoryService.delete(req.params.id, userId);
      return res.status(200).json(result);
   } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("menghapus Category")) {
         return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: "Gagal menghapus Category." });
   }
});

export default CategoryRouter;
