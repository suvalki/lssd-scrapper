import {hasUser, userAccess} from "@/utils/access-control/access-api";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
// @ts-ignore
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    const user = await userAccess("admin.invites.read")

    if (user) {
        const prisma = new PrismaClient()
        const invites = await prisma.inviteCode.findMany({
            where: {
                createdId: user.id
            },
            include: {
                created: true,
                activated: true,
                role: true
            },
            orderBy: {
                id: "desc"
            }
        })
        return NextResponse.json(invites)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}

export async function POST(req: Request) {
    const user = await userAccess("admin.invites.create")
    const body = await req.json()
    if (user && body.code) {
        const code = body.code
        const prisma = new PrismaClient()

        const role = await prisma.role.findFirst({
            where: {
                id: Number(body.roleId)
            },
            include: {
                permissions: true
            }
        })

        if (role && role.permissions.length > user.role.permissions.length) {
            return NextResponse.json({
                error: "Forbidden"
            }, {
                status: 403
            })
        }

        const invite = await prisma.inviteCode.create({
            data: {
                code: code,
                createdId: user.id,
                status: "unused",
                roleId: Number(body.roleId)
            },
        })
        return NextResponse.json(invite)
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}

export async function DELETE(req: Request) {
    const user = await userAccess("admin.invites.create")
    const body = await req.json()
    if (user && body.id) {
        const id = body.id
        const prisma = new PrismaClient()
        const invite = await prisma.inviteCode.delete({
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