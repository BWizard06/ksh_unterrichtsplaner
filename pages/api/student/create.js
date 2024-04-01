import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { classId, username } = req.body;

        try {
            const newStudent = await prisma.student.create({
                data: {
                    classId: classId,
                    username,
                },
            });

            const token = jwt.sign(
                { id: newStudent.id, classId, username },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

            res.status(201).json({
                message: "Schüler erfolgreich erstellt",
                token,
            });
        } catch (error) {
            console.error("Fehler beim Erstellen des Schülers:", error);
            res.status(500).json({
                error: "Fehler beim Erstellen des Schülers",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
