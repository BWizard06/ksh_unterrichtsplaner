import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "ID ist erforderlich." });
        }

        try {
            const response = await prisma.appointment.delete({
                where: {
                    id,
                }
            });

            if (!appointment) {
                return res
                    .status(404)
                    .json({ error: "Termin nicht gefunden. " });
            }

            res.status(200).json(response);
        } catch {
            res.status(500).json({
                error: "Fehler beim Löschen des Termins",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
