import {User} from "@/types/users/user";

export type ForumAccount = {
    id: number,
    login: string,
    password: string,
    active: boolean,
    created: User,
    createdAt: Date
}