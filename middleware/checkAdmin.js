import jwt from "jsonwebtoken";

export const checkAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Нет доступа" });
        }
        const decoded = jwt.verify(token, "secret123");

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Нет доступа к панели админа" });
        }

        req.user = decoded;
        next()
    } catch (error) {
        res.status(500).json({ message: "Ошибка проверки админа" });
    }
};