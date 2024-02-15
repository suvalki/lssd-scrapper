import {object, string} from "yup";

export const InvitesFormSchema = object().shape({
    code: string().required("Код приглашения обязателен"),
    roleId: string().required("Роль обязательна"),
})