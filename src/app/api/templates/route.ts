import {userAccess} from "@/utils/access-control/access-api";
import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
// @ts-ignore
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    const user = await userAccess()

    if (user) {
        const prisma = new PrismaClient()
        const templates = await prisma.template.findMany({
            where: {
                createdId: user.id
            },
            orderBy: {
                id: "desc"
            }
        })
        return NextResponse.json(templates)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}

export async function POST(req: Request) {
    const user = await userAccess()
    const body = await req.json()
    if (user && body) {
        const prisma = new PrismaClient()
        const template = await prisma.template.create({
                data: {
                    createdId: user.id,
                    ...body
                },
            })
            return NextResponse.json(template)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}

