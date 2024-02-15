import {userAccess} from "@/utils/access-control/access-api";
import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function PUT(req: Request) {
    const user = await userAccess()
    const body = await req.json()
    if (user && body.id) {
        const prisma = new PrismaClient()
        const {id} = body
        await prisma.forumAccount.updateMany({
            where: {
                active: true,
                createdId: user.id
            },
            data: {
                active: false
            },
        })
        const account = await prisma.forumAccount.update({
            where: {
                id: body.id,
                createdId: user.id
            },
            data: {
                active: true
            },
        })
        return NextResponse.json(account)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })
}