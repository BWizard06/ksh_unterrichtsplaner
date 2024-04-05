import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "PUT") {
        const { id, teacherId, title, start_time, end_time, notes } = req.body;

        if (!id || !teacherId || !title || !start_time || !end_time) {
            return res
                .status(400)
                .json({ message: "Alle Felder müssen ausgefüllt sein." });
        }

        try {
            const updatedAppointment = await prisma.appointment.update({
                where: { id: id },
                data: { teacherId, title, start_time, end_time, notes },
            });

            res.json({ message: 'Appointment erfolgreich geändert', appointment: updatedAppointment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while updating the appointment.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}