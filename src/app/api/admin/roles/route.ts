import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import {userAccess} from "@/utils/access-control/access-api";
export async function GET() {
    const user = await userAccess()

    if (user) {
        const prisma = new PrismaClient()
        const roles = await prisma.role.findMany({
            include: {
                permissions: true
            }
        })
        return NextResponse.json(roles)
    }

    return NextResponse.json({error: "Forbidden"}, {
        status: 403
    })
}