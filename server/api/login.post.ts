import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { useDatabase } from "~/utils/database";

interface LoginBody {
  email: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const body: LoginBody = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return { statusCode: 400, message: "Email et mot de passe requis." };
  }

  const db = await useDatabase();
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return { statusCode: 400, message: "Utilisateur non trouvé." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { statusCode: 400, message: "Mot de passe incorrect." };
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  setCookie(event, "authToken", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  return {
    statusCode: 201,
    message: "Connexion réussie.",
  };
});
