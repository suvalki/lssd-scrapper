import {User} from "@/types/users/user";
// @ts-ignore
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";


export const hasUser = async (token: string) => {
    try {
        const data = jwt.verify(token, "lssd-scrapper-2024")

        const prisma = new PrismaClient()

        const user = await prisma.user.findFirst({
            where: {
                id: data.id
            }
        })

        if (user) {
            return user
        }
        else {
            return false
        }
    }

    catch (e) {
        return e
    }
}
export const canAccess = (name: string, user: User) => {
    return user.role.permissions.some(p => p.name === name)
}

export const userAccess = async (name?: string) => {
    let token = await cookies().get("token")?.value || ""
    try {
        const {id} = jwt.verify(token, "lssd-scrapper-2024")
        if (id) {
            const prisma = new PrismaClient()


            const user = await prisma.user.findFirst({
                where: {
                    id: +id
                },
                include: {
                    role: {
                        include: {
                            permissions: true
                        }
                    }
                }
            })

            if (user && name && user.role.permissions.some(el => el.name === name)) {
                return user
            }
            else if (user && !name) {
                return user
            }


        }}
    catch (e) {}
    return false
}