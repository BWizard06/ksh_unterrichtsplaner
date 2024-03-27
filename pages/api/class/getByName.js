import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { name } = req.query;

        if (!name || name === "") {
            return res
                .status(400)
                .json({ error: "Klassenname ist erforderlich." });
        }

        try {
            const requested_class = await prisma.class.findUnique({
                where: {
                    name,
                },
                include: {
                    students: {
                        include: {
                            user: true,
                        },
                    },
                    lessons: true,
                    classTeacher: {
                        include: {
                            teacher: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!requested_class) {
                return res
                    .status(404)
                    .json({ error: "Klasse nicht gefunden." });
            }

            res.status(201).json(requested_class);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Fehler beim Holen der Klasse",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
