import bcrypt from "bcryptjs";
import { useDatabase } from "~/utils/database"; // Importer la méthode pour accéder à la base de données

interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default defineEventHandler(async (event) => {
  const body: RegisterBody = await readBody(event);

  const { firstName, lastName, email, password, confirmPassword } = body;

  // Validation des données
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return { statusCode: 400, message: "Tous les champs sont requis." };
  }

  if (password !== confirmPassword) {
    return {
      statusCode: 400,
      message: "Les mots de passe ne correspondent pas.",
    };
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return { statusCode: 400, message: "Veuillez entrer un email valide." };
  }

  // Vérification si l'email est déjà utilisé
  const db = await useDatabase();
  const existingUser = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return { statusCode: 400, message: "Cet email est déjà utilisé." };
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  // Enregistrer le nouvel utilisateur dans la base de données
  await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  return { statusCode: 201, message: "Inscription réussie." };
});
