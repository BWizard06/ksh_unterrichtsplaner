import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, classId } = req.body;

        try {
            const newStudent = await prisma.student.create({
                data: {
                    userId: userId,
                    classId: classId,
                },
            });

            res.status(201).json(newStudent);
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
