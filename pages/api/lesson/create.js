import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const {
                classId,
                teacherId,
                title,
                start_time,
                end_time,
                room,
                public_notes,
                private_notes,
            } = req.body;

            if (
                !classId ||
                !teacherId ||
                !title ||
                !start_time ||
                !end_time ||
                !room
            ) {
                return res
                    .status(400)
                    .json({ message: "Alle Felder müssen ausgefüllt sein." });
            }

            const exisiting_class = await prisma.class.findUnique({
                where: {
                    id: classId,
                },
            });

            if (!exisiting_class) {
                return res
                    .status(404)
                    .json({ message: "Klasse nicht gefunden." });
            }

            const exisiting_teacher = await prisma.teacher.findUnique({
                where: {
                    id: teacherId,
                },
            });

            if (!exisiting_teacher) {
                return res
                    .status(404)
                    .json({ message: "Lehrer nicht gefunden." });
            }

            const newLesson = await prisma.lesson.create({
                data: {
                    classId,
                    teacherId,
                    title,
                    start_time: new Date(start_time),
                    end_time: new Date(end_time),
                    room,
                    public_notes,
                    private_notes,
                },
            });

            return res.status(201).json(newLesson);
        } catch (error) {
            console.error("Fehler beim Erstellen der Lektion:", error);
            return res
                .status(500)
                .json({ message: "Fehler beim Erstellen de Lektion" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
