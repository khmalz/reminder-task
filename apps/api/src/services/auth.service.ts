import prisma from "../lib/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface AuthInput {
   email: string;
   password: string;
   name?: string;
}

const SECRET = process.env.SECRET_JWT!;

export const AuthService = {
   async register(data: AuthInput) {
      const { email, password, name } = data;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
         throw new Error("Email sudah terdaftar");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
         data: { email, name: name!, password: hashedPassword },
      });

      const { password: _, ...result } = newUser;
      return result;
   },

   async login(data: AuthInput) {
      const { email, password } = data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         throw new Error("Kredensial tidak valid");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         throw new Error("Kredensial tidak valid");
      }

      const payload = { sub: user.id, email: user.email };
      const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });

      return { access_token: token };
   },

   logout(userId: string) {
      return {
         success: true,
         userId: userId,
      };
   },
};
