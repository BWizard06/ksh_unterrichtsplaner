import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ message: "Der Name der Klasse ist erforderlich." });
        }

        const existingClass = await prisma.class.findUnique({
            where: { name: name },
        });

        if (existingClass) {
            return res
                .status(400)
                .json({ error: "Diese Klasse existiert bereits." });
        }

        try {
            const newClass = await prisma.class.create({
                data: { name: name },
            });

            res.status(201).json(newClass);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ein Fehler ist aufgetreten.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}