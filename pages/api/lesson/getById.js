import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const lesson = await prisma.lesson.findUnique({
                where: {
                    id,
                },
                include: {
                    files: true,
                    class: true,
                    teacher: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!lesson) {
                return res
                    .status(404)
                    .json({ error: "Lektion nicht gefunden. " });
            }

            res.status(200).json(lesson);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "Fehler beim Holen der Lektion",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
