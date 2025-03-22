import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidator, loginVaildator } from "./validation.js";
import checkAuth from "./middleware/checkAuth.js";
import * as Controller from "./controllers/controller.js";
import { createNewExcursion } from "./controllers/admin.js";
import { addUser } from "./controllers/purchase.js";
import { checkAdmin } from "./middleware/checkAdmin.js";
import { getAllExcursions, updateExcursion } from "./controllers/admin.js";

export const app = express();

mongoose.connect("mongodb+srv://admin:UJwMAUXJtGSsXvR3@project.i3rhg.mongodb.net/proj?retryWrites=true&w=majority&appName=project")
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

app.get('/auth/me', checkAuth, Controller.getMe);

app.post("/admin/add", checkAuth, createNewExcursion);

app.post('/excursions/purchase', checkAuth, addUser);

app.get("/admin/all", checkAuth, checkAdmin, getAllExcursions);

app.put("/admin/excursions/:id", checkAuth, checkAdmin, updateExcursion);

app.listen("4444", (err) => {
    if (err) {
        console.log(err);
    }
    console.log("server address: http://localhost:4444/");
});