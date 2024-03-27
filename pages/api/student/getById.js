import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const student = await prisma.student.findUnique({
                where: {
                    id,
                },
                include: {
                    class: true,
                },
            });

            if (!student) {
                return res
                    .status(404)
                    .json({ error: "Schüler nicht gefunden. " });
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
