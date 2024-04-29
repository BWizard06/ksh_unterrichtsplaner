import multer from "multer";
import { PrismaClient } from "@prisma/client";

export const config = {
    api: {
        bodyParser: false,
    },
};

const prisma = new PrismaClient();

const upload = multer({ storage: multer.memoryStorage() }).single("file");

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end(`Method ${req.method} not allowed`);
    }

    upload(req, res, async (error) => {
        if (error instanceof multer.MulterError) {
            return res
                .status(500)
                .json({ message: `Multer uploading error: ${error.message}` });
        } else if (error) {
            return res
                .status(500)
                .json({ message: `Failed to upload file: ${error.message}` });
        }

        const json = JSON.parse(req.body.json);
        const lessonId = json.lessonId;
        const visibility = json.visibility;

        if (!req.file || !lessonId) {
            return res
                .status(400)
                .json({ message: "Erforderliche Felder fehlen." });
        }

        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonId,
            },
        });

        if (!lesson) {
            return res.status(404).json({ message: "Lektion nicht gefunden." });
        }

        try {
            const file = await prisma.file.create({
                data: {
                    lessonId,
                    file_name: req.file.originalname,
                    file_type: req.file.mimetype,
                    binary_file: req.file.buffer,
                    visibility,
                },
            });

            return res.status(201).json(file);
        } catch (error) {
            console.error("Fehler beim Hochladen der Datei:", error);
            return res
                .status(500)
                .json({ message: "Fehler beim Hochladen der Datei" });
        }
    });
}
