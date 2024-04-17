import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username und Passwort sind erforderlich" });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { username: username },
            });

            if (!user) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password." });
            }

            const teacher = await prisma.teacher.findUnique({
                where: { userId: user.id },
            });

            const token = jwt.sign(
                { id: teacher.id, username: user.username, role: "teacher" },
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
