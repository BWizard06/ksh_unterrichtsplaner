import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const file = await prisma.file.findUnique({
                where: {
                    id,
                },
            });

            if (!file) {
                return res.status(404).json({ error: "File nicht gefunden. " });
            }

            res.status(200).json(file);
        } catch {
            res.status(500).json({
                error: "Fehler beim Holen des Files",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
