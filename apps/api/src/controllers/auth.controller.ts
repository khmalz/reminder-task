import { Request, Response, Router } from "express";
import { AuthService } from "../services/auth.service";
import { AuthMiddleware } from "../middleware/auth.middleware";

interface AuthenticatedRequest extends Request {
   user?: {
      id: string;
      email: string;
   };
}

const AuthRouter = Router();

AuthRouter.post("/register", async (req: Request, res: Response) => {
   try {
      const newUser = await AuthService.register(req.body);
      return res.status(201).json(newUser);
   } catch (error: any) {
      if (error.message === "Email sudah terdaftar") {
         return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: "Gagal melakukan registrasi" });
   }
});

AuthRouter.post("/login", async (req: Request, res: Response) => {
   try {
      const result = await AuthService.login(req.body);
      return res.status(200).json(result);
   } catch (error: any) {
      if (error.message === "Kredensial tidak valid") {
         return res.status(401).json({ error: "Email atau password salah" });
      }
      return res.status(500).json({ error: "Gagal melakukan login" });
   }
});

AuthRouter.post("/logout", AuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
   if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Token tidak terverifikasi." });
   }

   AuthService.logout(req.user.id);

   return res.status(200).json({
      message: `Logout berhasil untuk pengguna ID: ${req.user.id}. Token sudah diverifikasi.`,
      note: "Token harus dibuang di sisi klien.",
   });
});

export default AuthRouter;
