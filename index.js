import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from 'dotenv';
import cors from 'cors';

import { registerValidator, loginVaildator, addUserValidator } from "./validation.js";
import checkAuth from "./middleware/checkAuth.js";
import * as Controller from "./controllers/controller.js";
import * as AdminController from "./controllers/admin.js";
import { checkAdmin } from "./middleware/checkAdmin.js";

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
app.use(cors({
   origin: "http://localhost:3000"
}));

app.post("/login", loginVaildator, Controller.login); //есть фронтенд

app.post("/register", registerValidator, Controller.register); //есть фронтенд


app.get('/me', checkAuth, Controller.getUser);

app.post("/upload", upload.single('image'), (req, res)=>{ // не работает
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post("/admin/add", checkAuth, AdminController.createNewExcursion); // мб  вернуть такой

app.post('/excursions/purchase', checkAuth, addUserValidator, Controller.addUserIntoExcursion);

app.get("/admin/all", checkAuth, checkAdmin, AdminController.manageExcursions);

app.get("/excursions/all",  Controller.getExcursions); // есть фронтенд

app.put("/admin/excursions/:id", checkAuth, checkAdmin, AdminController.updateExcursion);

app.delete("/admin/excrusions/delete/:id", checkAuth, checkAdmin, AdminController.removeOne) // Todo- возмжно надо переделать маршрут убрав /delete

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`server address: http://localhost:${process.env.PORT}`);
});