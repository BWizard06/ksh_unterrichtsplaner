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

        try {
            const user = await prisma.user.findUnique({
                where: {
                    username,
                },
            });

            if (!user) {
                return res.status(404).json({ error: "User nicht gefunden." });
            }

            const student = await prisma.student.findUnique({
                where: {
                    userId: user.id,
                },
                include: {
                    class: true,
                },
            });

            if (!student) {
                return res.status(404).json({
                    error: "Schüler nicht gefunden. Vermutlich ist der username ein Lehrer",
                });
            }

            res.status(201).json(student);
        } catch {
            res.status(500).json({
                error: "Fehler beim Holen des Schülers",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
