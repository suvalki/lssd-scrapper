import {userAccess} from "@/utils/access-control/access-api";
import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
// @ts-ignore
import jwt from "jsonwebtoken";
import {checkForumAccount} from "@/libs/forum-libs/check-user";

export async function GET(req: Request) {
    const user = await userAccess()

    if (user) {
        const prisma = new PrismaClient()
        const accounts = await prisma.forumAccount.findMany({
            where: {
                createdId: user.id
            },
            orderBy: {
                id: "desc"
            }
        })
        return NextResponse.json(accounts)
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

        const hasAccount = await checkForumAccount(body.login, body.password)
        if (hasAccount) {
            const account = await prisma.forumAccount.create({
                data: {
                    login: body.login,
                    createdId: user.id,
                    password: body.password,
                    active: false,
                    sid: hasAccount
                },
            })
            return NextResponse.json(account)
        }
        else {
            return NextResponse.json({
                error: "Account Not Found"
            }, {
                status: 404
            })
        }
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}

export async function PUT(req: Request) {
    const user = await userAccess()
    const body = await req.json()
    if (user && body.id) {
        const prisma = new PrismaClient()
        const {login, password, active} = body
        const account = await prisma.forumAccount.update({
            where: {
                id: body.id,
                createdId: user.id
            },
            data: {
                login, password, active
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

export async function DELETE(req: Request) {
    const user = await userAccess()
    const body = await req.json()
    if (user && body.id) {
        const id = body.id
        const prisma = new PrismaClient()
        const account = await prisma.forumAccount.delete({
            where: {
                createdId: user.id,
                id: id
            },
        })
        return NextResponse.json({}, {
            status: 200
        })
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}