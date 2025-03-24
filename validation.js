import { body } from "express-validator";

export const registerValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('fullName').isLength({min: 3}),
]

export const addUserValidator = [
    body('userId').isMongoId(),
    body('excursionId').isMongoId(),
    //body('date').isDate() Todo-  не раскоменчивать пока не проверено на адекватаную работу
]

export const loginVaildator = [
    body('email').isEmail(),
    body('password').isLength({min: 6})
]

export const postCreateValidation = [
    body('title', "Название").isString(),
    body('description', "Описание").isString(),
    body('location', "location").isString(),
    body('date', "Date").isDate(),
    body('price', "Price").isInt(),
    body('maxParticipants', "max people").isInt(),
]