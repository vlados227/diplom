import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import dotenv from 'dotenv';

import Excursion from "../models/Excursion.js";
import User from '../models/user.js'
dotenv.config();

function tokenize(user, res) {
   const token = jwt.sign(
      {
         _id: user._id,
         role: user.role,
      },
      process.env.SECRET_KEY,
      {
         expiresIn: "30d",
      }
   );
   const { passwordHash, ...userData } = user._doc;

   res.json({
      ...userData,
      token,
   });
}

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
        });


        const user = await doc.save();
        tokenize(user, res)
    } catch (err) {
        res.status(500).json({
            message: err+ " Не удалось зарегистрироваться",
        });
    }
};
export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const isValidpasswd = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidpasswd) {
            return res.status(400).json({
                message: "Неверный пароль",
            });
        }
        tokenize(user, res);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err + "Не удалось войти",
        });
    }
};
export const getUser = async(req, res)=> {
    try {
        const user = await User.findById(req.userId);
        
        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден",
            }); 
        }
        const excursion = await Excursion.find({participants: user._id}).populate({
            path: 'participants',
            select: `fullName email`,
        });
         const { passwordHash, ...userData } = user._doc;
      
         res.json({userData, excursion});
            
    } catch (err) {
        res.status(500).json({
            message: err+ "no",
        });  
    }
};

export const getExcursions = async (req, res) => { //проверить пагинацию
    try {
        const {page = 1, limit = 10} = req.query;
        const skip = (page - 1) * limit;
        const excursions = await Excursion.find({},"_id title description location date maxParticipants price image")
        .skip(skip)
        .limit(Number(limit));
        const total = await Excursion.countDocuments();
        res.status(200).json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            excursions,
        })
    } catch (error) {
        res.status(500).json({
            message: error + " Не удалось получить экскурсии",
        });
    }
}
export const addUserIntoExcursion = async (req, res) => {
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