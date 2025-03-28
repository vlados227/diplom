import Excursion from "../models/Excursion.js";

export const manageExcursions = async (req, res) => {
    try {
        const excursions = await Excursion.find().populate("participants", "fullName email");
        res.status(200).json({excursion: excursions});
    } catch (error) {
        res.status(500).json({ message: "Не удалось получить экскурсии" });
    }
}


export const removeOne = async (req, res) => {
    try {
        const {id} = req.params;
        const excursion = await Excursion.findByIdAndDelete(id);
        res.status(200).json("Данная экскурсия \n"+excursion + " удалена");
    } catch (error) {
        return res.status(404).json({
            message:"Не удалось удалить экскурсию "+ error});
    }
}

export const updateExcursion = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedExcursion = await Excursion.findByIdAndUpdate(
            id, updatedData, { new: true }
        );
        if (!updatedExcursion) {
            return res.status(404).json({ message: "Экскурсия не найдена" });
        }
        res.status(200).json(updatedExcursion);
    } catch (error) {
        res.status(500).json({ message: "Не удалось обновить экскурсию "+error });
    }
};

export const createNewExcursion = async (req, res) => {
    try {
        const { title, description, price, date, maxParticipants, location } = req.body;

        const newExcursion = new Excursion({
            title,
            description,
            price,
            date,
            maxParticipants,
            location
        });

        const savedExcursion = await newExcursion.save();

        res.status(201).json(savedExcursion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось создать экскурсию ' + error });
    }
};