import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, classIds } = req.body;

        if (!userId || !classIds) {
            return res
                .status(400)
                .json({ error: "UserId und ClassIds sind erforderlich." });
        }

        try {
            const result = await prisma.$transaction(async (prisma) => {
                const teacher = await prisma.teacher.create({
                    data: {
                        userId,
                    },
                });

                const classTeacher = await prisma.ClassTeacher.createMany({
                    data: classIds.map((classId) => ({
                        teacherId: teacher.id,
                        classId,
                    })),
                });

                return { teacher, classTeacher };
            });

            res.status(201).json(result);
        } catch (error) {
            console.error(
                "Fehler beim Erstellen des Lehrers und seiner Klassen:",
                error
            );
            res.status(500).json({
                error: "Fehler beim Erstellen des Lehrers und seiner Klassen",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
