import {userAccess} from "@/utils/access-control/access-api";
import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET(req: Request, { params:{id} }: { params: { id: number } }) {
    const user = await userAccess()

    if (user) {
        const prisma = new PrismaClient()
        const templates = await prisma.template.findFirst({
            where: {
                id: Number(id),
                createdId: user.id
            },
        })
        return NextResponse.json(templates, {
            status: templates ? 200 : 404
        })
    }
    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })

}

export async function PUT(req: Request, { params:{id} }: { params: { id: number } }) {
    const user = await userAccess()
    const body = await req.json()
    if (user && body && id) {
        const prisma = new PrismaClient()
        const {description, name, code, elements} = body
        const template = await prisma.template.update({
            where: {
                id: Number(id),
                createdId: user.id

            },
            data: {
                description, name, code, elements
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

export async function DELETE(req: Request, { params:{id} }: { params: { id: number } }) {
    const user = await userAccess()
    if (user && id) {
        const prisma = new PrismaClient()
        const template = await prisma.template.delete({
            where: {
                createdId: user.id,
                id: +id
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