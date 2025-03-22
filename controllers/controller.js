import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";

import UserModel from '../models/user.js'

function tokenize(user, res) {
   const token = jwt.sign(
      {
         _id: user._id,
         role: user.role,
      },
      "secret123",
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

        const doc = new UserModel({
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
        const user = await UserModel.findOne({ email: req.body.email });
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
export const getMe = async(req, res)=>{
    try {
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден",
            }); 
        }
         const { passwordHash, ...userData } = user._doc;
      
         res.json({userData});
            
    } catch (err) {
        res.status(500).json({
            message: err+ "no",
        });  
    }
}