import {boolean, object, string} from "yup";

export const TemplateSettingsFormSchema = object().shape({
    name: string().required("Обязательное поле"),
    description: string(),
    code: string().required("Обязательное поле"),
    forAll: boolean()
})