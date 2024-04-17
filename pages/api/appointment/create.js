import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { teacherId, title, start_time, end_time, notes, location, imported } = req.body;

            if (!teacherId || !title || !start_time || !end_time || imported === undefined ) {
                return res
                    .status(400)
                    .json({ message: "Alle Felder müssen ausgefüllt sein." });
            }

            const existing_teacher = await prisma.teacher.findUnique({
                where: {
                    id: teacherId,
                },
            });

            if (!existing_teacher) {
                return res
                    .status(404)
                    .json({ message: "Lehrer nicht gefunden." });
            }

            const newAppointment = await prisma.appointment.create({
                data: {
                    teacherId,
                    title,
                    start_time: start_time,
                    end_time: end_time,
                    notes,
                    location,
                    imported
                },
            });

            return res.status(201).json(newAppointment);
        } catch (error) {
            console.error("Fehler beim Erstellen des Termins:", error);
            return res
                .status(500)
                .json({ message: "Fehler beim Erstellen des Termins" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
