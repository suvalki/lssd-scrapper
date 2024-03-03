import {userAccess} from "@/utils/access-control/access-api";
import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import {checkForumUser} from "@/libs/forum-libs/check-user";
import puppeteer from "puppeteer";

export async function GET(req: Request,{ params:{id} }: { params: { id: number } }) {
    const user = await userAccess("topics.access")

    if (user && id) {
        const prisma = new PrismaClient()
        const topic = await prisma.topic.findFirst({
            where: {
                id: +id,
                createdId: user.id
            },
            include: {
                topicAnswers: true,
            },
            orderBy: {
                id: "desc"
            }
        })
        return NextResponse.json(topic)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })
}


export async function DELETE(req: Request,{ params:{id} }: { params: { id: number } }) {
    const user = await userAccess("topics.access")

    try {
    if (user) {
        const prisma = new PrismaClient()
        await prisma.topic.delete({
            where: {
                id: +id,
                createdId: user.id
            }
        })
        return NextResponse.json({})
    }
    } catch (e) {
        console.log(e)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })
    
}