import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
// @ts-ignore
import {userAccess} from "@/utils/access-control/access-api";


export async function GET(req: Request, {params}: { params: { code: string } }) {
    const user = await userAccess()

    if (!user) {
        const prisma = new PrismaClient()
        const invite = await prisma.inviteCode.findFirst({
            where: {
                code: params.code
            },
            include: {
                role: true,
                created: true
            }
        })
        if (invite) {
            return NextResponse.json(invite)
        }
        else {
            return NextResponse.json({error: "Not Found"}, {
                status: 404
            })
        }
    }
    return NextResponse.json({error: "Forbidden"}, {
        status: 403
    })

}