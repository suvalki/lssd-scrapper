
import {PrismaClient} from "@prisma/client";
// @ts-ignore
import {userAccess} from "@/utils/access-control/access-api";
import {NextResponse} from "next/server";
// @ts-ignore
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import {sanitizer} from "@/libs/prisma-libs/sanitizer";

export async function POST(req: Request) {
    const body = await req.json()
    const user = await userAccess()

    if (body && !user) {
        const prisma = new PrismaClient()

        const invite = await prisma.inviteCode.findFirst({
            where: {
                code: body.code,
                status: "unused"
            }
        })

        if (invite) {
            try {
                const user = await prisma.user.create({
                    data: {
                        login: body.login,
                        password: body.password,
                        name: body.name,
                        roleId: invite.roleId,
                        activeInvite: {
                            connect: {
                                id: invite.id
                            }
                        },
                    },
                    include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        },
                        activeInvite: true,
                        templatesCreated: true,
                        invitesCreated: true,
                        forumAccounts: true,
                        forumFields: true
                    }
                })

                await prisma.inviteCode.update({
                    where: {
                        id: invite.id
                    },
                    data: {
                        status: "used",
                        activatedId: user.id
                    }
                })

                const token = jwt.sign({
                    id: user.id
                }, "lssd-scrapper-2024", {expiresIn: "1d"});

                cookies().set("token", token)

                return NextResponse.json(sanitizer("user", {...user, token: token}))
            }

            catch (e: any) {
                if (e.meta.target.includes("login")) {
                    return NextResponse.json({error: "Login already exists"}, {
                        status: 400
                    })
                }
            }


        }
    }
    return NextResponse.json({error: "Forbidden"}, {
        status: 403
    })
}