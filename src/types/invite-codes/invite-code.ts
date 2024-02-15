import {User} from "@/types/users/user";
import {Role} from "@/types/users/role";

export type InviteCode = {
    id: number,
    code: string,
    status: string
    activated?: User
    created: User,
    createdAt: Date,
    role: Role
}