import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from 'dotenv';

import { registerValidator, loginVaildator, addUserValidator } from "./validation.js";
import checkAuth from "./middleware/checkAuth.js";
import * as Controller from "./controllers/controller.js";
import { createNewExcursion } from "./controllers/admin.js";
import { addUserIntoExcursion } from "./controllers/purchase.js";
import { checkAdmin } from "./middleware/checkAdmin.js";
import { manageExcursions, updateExcursion, removeOne } from "./controllers/admin.js";

dotenv.config();
export const app = express();

const storage = multer.diskStorage({ //Todo- доделать загрузку картинок
    destination: (req, file, callback) =>{
        callback(null, 'uploads');
    },
    filename: (req, file, callback) =>{
        callback(null, file.originalname);
    }
});
const upload = multer({storage});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("db ok");
        console.log('ready');
    })
    .catch((err) => {
        console.log("error: ", err);
    });

app.use(express.json())

app.post("/auth/login", loginVaildator, Controller.login);

app.post("/auth/register", registerValidator, Controller.register);

app.get('/auth/me', checkAuth, Controller.getUser);

app.post("/upload", upload.single('image'), (req, res)=>{ // не работает
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

//app.post("/admin/add", checkAuth, createNewExcursion); // мб  вернуть такой
app.post("/excursions", checkAuth, checkAdmin, createNewExcursion);

app.post('/excursions/purchase', checkAuth, addUserValidator, addUserIntoExcursion);

app.get("/admin/all", checkAuth, checkAdmin, manageExcursions);

app.get("/excursions/all", checkAuth, Controller.getExcursions);

app.put("/admin/excursions/:id", checkAuth, checkAdmin, updateExcursion);

app.delete("/admin/excrusions/delete/:id", checkAuth, checkAdmin, removeOne) // Todo- возмжно надо переделать маршрут убрав /delete

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`server address: http://localhost:${process.env.PORT}`);
});