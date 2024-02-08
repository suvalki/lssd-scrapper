import {object, string} from "yup";

export const noTemplateFormSchema = object().shape({
    recipients: string().required("Поле обязательное"),
    subject: string().required("Поле обязательное"),
    message: string().required("Поле обязательное"),
})