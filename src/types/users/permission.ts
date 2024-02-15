import {Role} from "@/types/users/role";

export type Permission = {
    id: number,
    name: string,
    roles: Role[],
    createdAt: Date
}