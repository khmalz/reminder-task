import { Request, Response, Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { TaskInput, TaskService } from "../services/task.service";

interface AuthenticatedRequest extends Request {
   user?: {
      id: string;
      email: string;
   };
}

const TaskRouter = Router();

TaskRouter.use(AuthMiddleware);

TaskRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });

   const { title, categoryIds } = req.body;

   if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ error: "Array categoryIds wajib disertakan dan tidak boleh kosong." });
   }
   if (typeof title !== "string" || title.length === 0) {
      return res.status(400).json({ error: 'Body field "title" wajib diisi.' });
   }

   try {
      const newTask = await TaskService.create(req.body, userId);
      return res.status(201).json(newTask);
   } catch (error: any) {
      if (error.message.includes("minimal satu kategori")) {
         return res.status(400).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: "Gagal membuat tugas." });
   }
});

TaskRouter.get("/", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });

   try {
      const tasks = await TaskService.findAll(userId);
      if (tasks.length === 0) {
         return res.status(200).json({ message: "Tugas kosong." });
      }

      return res.status(200).json(tasks);
   } catch (error) {
      return res.status(500).json({ error: "Gagal mengambil tugas." });
   }
});

TaskRouter.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });

   try {
      const task = await TaskService.findOne(req.params.id, userId);
      return res.status(200).json(task);
   } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
         return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Gagal mengambil tugas." });
   }
});

TaskRouter.patch("/:id", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });

   const { title, categoryIds, isCompleted } = req.body;

   const updateData: Partial<TaskInput> = {};
   if (title !== undefined) updateData.title = title;
   if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

   if (categoryIds !== undefined) {
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
         return res.status(400).json({ error: "Array categoryIds tidak valid dan tidak boleh kosong." });
      }
      updateData.categoryIds = categoryIds;
   }

   try {
      const updatedTask = await TaskService.update(req.params.id, userId, updateData);
      return res.status(200).json(updatedTask);
   } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
         return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Gagal memperbarui tugas." });
   }
});

TaskRouter.delete("/:id", async (req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?.id;
   if (!userId) return res.status(401).json({ error: "Akses tidak sah." });

   try {
      const result = await TaskService.delete(req.params.id, userId);
      return res.status(200).json(result);
   } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
         return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Gagal menghapus tugas." });
   }
});

export default TaskRouter;
