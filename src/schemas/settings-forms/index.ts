import {object, ref, string} from "yup";

export const changePasswordFormSchema = object().shape({
    oldPassword: string().required("Поле обязательное"),
    newPassword: string().required("Поле обязательное").min(6, "Минимальная длина пароля 6 символов"),
    confirmPassword: string().required("Поле обязательное").oneOf([ref("newPassword")], "Пароли должны совпадать"),
})

export const forumAccountsFormSchema = object().shape({
    login: string().required("Поле обязательное"),
    password: string().required("Поле обязательное"),
})