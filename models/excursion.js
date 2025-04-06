import mongoose from "mongoose";

const Excursion = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [],
    },
    image: {
        type: String,
        reqired: true
    }
});

export default mongoose.model("Excursion", Excursion);