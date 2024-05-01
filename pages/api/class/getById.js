import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const requested_class = await prisma.class.findUnique({
                where: {
                    id,
                },
                include: {
                    students: true,
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
                    .json({ error: "Klasse nicht gefunden. " });
            }

            res.status(200).json(requested_class);
        } catch {
            res.status(500).json({
                error: "Fehler beim Holen des Files",
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
