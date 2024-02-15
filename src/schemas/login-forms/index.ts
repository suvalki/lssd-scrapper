import {object, ref, string} from "yup";

export const LoginFormSchema = object().shape({
    login: string().required("Поле обязательно"),
    password: string().required("Поле обязательно")
})

export const InviteFormSchema = object().shape({
    code: string().required("Поле обязательно"),
})

export const InviteRegisterFormSchema = object().shape({
    name: string().required("Поле обязательно"),
    login: string().required("Поле обязательно"),
    password: string().required("Поле обязательно").min(6, "Пароль должен быть больше 6 символов"),
    confirmPassword: string().required("Поле обязательно").oneOf([ref("password")], "Пароли должны совпадать"),
})