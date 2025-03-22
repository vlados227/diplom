import Excursion from "../models/Excursion.js";

export const addUser = async (req, res) => {
    try {
        const { excursionId, userId, date } = req.body;
        const excursion = await Excursion.findById(excursionId);

        if (!excursion) {
            return res.status(404).json({
                message: "Экскурсия не найдена",
            });
        }

        if (excursion.date < date) {
            return res.status(401).json({
                message: "Экскурсия уже прошла",
            });
        }

        if (excursion.participants.includes(userId)) {
            return res.status(403).json({
                message: "Вы уже записаны на эту экскурсию",
            });
        }

        if (excursion.participants.length >= excursion.maxParticipants) {
            return res.status(400).json({
                message: "Мест нет",
            });
        }

        excursion.participants.push(userId);
        await excursion.save();

        res.status(200).json({ message: "Пользователь записался на экскурсию" });
    } catch (error) {
        res.status(500).json({
            message: error + " Не удалось записаться на экскурсию",
        });
    }
};