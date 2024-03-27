import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res
                    .status(400)
                    .json({ message: "Alle Felder müssen ausgefüllt sein." });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });

            return res
                .status(201)
                .json({
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                });
        } catch (error) {
            console.error("Fehler beim Erstellen des Benutzers:", error);
            return res
                .status(500)
                .json({ message: "Fehler beim Erstellen des Benutzers" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} not allowed`);
    }
}
