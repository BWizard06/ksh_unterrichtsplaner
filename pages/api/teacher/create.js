import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, password, email, classIds } = req.body;

        if (!username || !password || !email || !classIds) {
            return res
                .status(400)
                .json({ error: "Alle Felder müssen ausgefüllt sein" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const userId = user.id;
        let teacherId = null;

        try {
            const result = await prisma.$transaction(async (prisma) => {
                const teacher = await prisma.teacher.create({
                    data: {
                        userId,
                    },
                });

                teacherId = teacher.id;

                const classTeacher = await prisma.ClassTeacher.createMany({
                    data: classIds.map((classId) => ({
                        teacherId: teacherId,
                        classId,
                    })),
                });

                return { teacher, classTeacher };
            });

            const token = jwt.sign(
                { id: teacherId, username, role: "teacher" },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

            res.status(201).json({
                message: "Lehrer und Klassen erfolgreich erstellt",
                token,
            });
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
