import {object, string} from "yup";

export const CreateTopicFormSchema = object().shape({
    url: string().url("Некорректная ссылка").required("Обязательное поле"),
    name: string().required("Обязательное поле"),
})