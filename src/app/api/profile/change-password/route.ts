import {userAccess} from "@/utils/access-control/access-api";
import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const user = await userAccess()

    if (user) {
        const { oldPassword, newPassword } = await req.json()
        if (oldPassword && newPassword) {
            const prisma = new PrismaClient()

            const password = await prisma.user.findFirst({
                where: {
                    id: user.id
                },
                select: {
                    password: true
                }
            })

            if (oldPassword !== password?.password) {
                return NextResponse.json({ error: "Wrong password" }, {
                    status: 403
                })
            }

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: newPassword
                }
            })

            return NextResponse.json({ success: true })
        }
    }

    return NextResponse.json({ error: "Forbidden" }, {
        status: 403
    })
}