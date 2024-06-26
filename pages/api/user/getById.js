import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    teacher: {
                        include: {
                            classTeacher: {
                                include: {
                                    class: true,
                                },
                            },
                        },
                    }
                },
            });

            if (!user) {
                return res.status(404).json({ error: "User nicht gefunden. " });
            }

            res.status(200).json(user);
        } catch {
            res.status(500).json({
                error: "Fehler beim Holen des Users",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
