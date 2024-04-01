import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ error: "Der Name der Klasse ist erforderlich" });
        }

        try {
            const newClass = await prisma.class.create({
                data: {
                    name,
                },
            });

            res.status(201).json(newClass);
        } catch (error) {
            console.error("Fehler beim Erstellen der Klasse:", error);
            res.status(500).json({ error: "Fehler beim Erstellen der Klasse" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
