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

app.use('/uploads', express.static('uploads'));

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
   origin: "http://localhost:3000" || "http://10.33.0.2:3000"
}));

app.get('/me', checkAuth, Controller.getUser);

app.post("/login", loginVaildator, addUserValidator,Controller.login);
app.post("/register", registerValidator, Controller.register);

app.post('/excursions/purchase', checkAuth, addUserValidator, Controller.addUserIntoExcursion);

app.get("/excursions/all",  Controller.getExcursions);

//маршруты адмнистратора
app.post("/admin/add", checkAuth, upload.single('image'), AdminController.createNewExcursion);

app.get("/admin/all", checkAuth, checkAdmin, AdminController.manageExcursions);

app.put("/admin/excursions/:id", checkAuth, checkAdmin, AdminController.updateExcursion);

app.delete("/admin/excursions/delete/:id", checkAuth, checkAdmin, AdminController.removeOne);

app.get("/admin/excursions/:id", checkAuth, checkAdmin, AdminController.getExcursionById)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`server address: http://192.168.0.104:${process.env.PORT}`);
});