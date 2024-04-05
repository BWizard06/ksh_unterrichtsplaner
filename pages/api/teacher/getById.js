import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const teacher = await prisma.teacher.findUnique({
                where: {
                    id,
                },
                include: {
                    classTeacher: {
                        include: {
                            class: true,
                        },
                    },
                    appointments: true,
                    lessons: true,
                },
            });

            if (!teacher) {
                return res
                    .status(404)
                    .json({ error: "Lehrer nicht gefunden. " });
            }

            res.status(200).json(teacher);
        } catch {
            res.status(500).json({
                error: "Fehler beim Holen des Lehrers und seiner Klassen",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
