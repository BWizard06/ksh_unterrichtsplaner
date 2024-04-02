import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {token } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            res.status(201).json({
                valid: true,
                decoded,
            });
        } catch (error) {
            console.error("Fehler beim Überprüfen des Tokens:", error);
            res.status(500).json({
                error: "Fehler beim Überprüfen des Tokens",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
