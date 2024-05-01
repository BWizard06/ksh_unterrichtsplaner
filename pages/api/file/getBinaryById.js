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
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${file.file_name}`
            );
            res.setHeader("Content-Type", file.file_type);

            res.status(200).send(file.binary_file);
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
