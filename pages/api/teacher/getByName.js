import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { username } = req.query;

        if (!username || username === "") {
            return res
                .status(400)
                .json({ error: "Username ist erforderlich." });
        }

        console.log(req.body);

        try {
            const user = await prisma.user.findUnique({
                where: {
                    username,
                },
            });

            if (!user) {
                return res.status(404).json({ error: "User nicht gefunden." });
            }

            const teacher = await prisma.teacher.findUnique({
                where: {
                    userId: user.id,
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
                return res.status(404).json({
                    error: "Lehrer nicht gefunden. Der username ist vermutlich ein Schüler",
                });
            }

            // allow cors in header
            res.setHeader("Access-Control-Allow-Origin", "*");

            res.status(201).json(teacher);
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
