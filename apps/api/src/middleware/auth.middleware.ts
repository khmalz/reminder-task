import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

interface AuthenticatedRequest extends Request {
   user?: {
      id: string;
      email: string;
   };
}

const SECRET = process.env.SECRET_JWT!;

export const AuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
   }

   const token = authHeader.split(" ")[1];

   try {
      const decoded: any = jwt.verify(token, SECRET);

      const user = await prisma.user.findUnique({
         where: { id: decoded.sub },
         select: { id: true, email: true },
      });

      if (!user) {
         return res.status(401).json({ error: "Token tidak valid. Pengguna tidak ditemukan." });
      }

      req.user = user;

      next();
   } catch (error) {
      return res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa." });
   }
};
