import {Permission} from "@/types/users/permission";


export type Role = {
    id: number
    name: string,
    permissions: Permission[],
    createdAt: Date
}
