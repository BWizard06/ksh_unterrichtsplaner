import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }

        try {
            const student = await prisma.student.findUnique({
                where: { username: username },
                include: { class: true },
            });

            if (!student) {
                return res.status(404).json({ message: "Student not found." });
            }

            const token = jwt.sign(
                {
                    id: student.id,
                    username: student.username,
                    classId: student.class.id,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({ message: "Login successful.", token: token });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "An error occurred while logging in.",
            });
        }
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
