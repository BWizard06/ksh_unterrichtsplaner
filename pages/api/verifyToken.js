import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {token } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { id, username, role } = decoded;

            res.status(200).json({
                valid: true,
                decoded,
                id,
                username,
                role
            });
        } catch (error) {
            console.error("Fehler beim Überprüfen des Tokens:", error);
            res.status(401).json({
                error: "Unauthorized",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}