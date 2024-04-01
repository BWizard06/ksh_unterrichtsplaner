import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {

        try {
            const requested_class = await prisma.class.findMany({
               
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
                error: "Fehler beim Holen der Klasse",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
