import {cookies} from "next/headers";
import {PrismaClient} from "@prisma/client";
// @ts-ignore
import jwt from "jsonwebtoken";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    const {body} = req
    const prisma = new PrismaClient()

    if (cookies().has("token")) {
        try {
            const token = jwt.verify(cookies().get("token")?.value, "lssd-scrapper-2024")
            if (token) {

                const forAllTemplates = await prisma.template.findMany({
                    where: {
                        forAll: true
                    }
                })

                const user = await prisma.user.findFirst({
                    where: {
                        id: token.id
                    },
                    include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        },
                        forumAccounts: true,
                        invitesCreated: true,
                        templatesCreated: true,
                        activeInvite: {
                            include: {
                                created: true
                            }
                        }
                    }
                })
                if (user) {
                    return NextResponse.json({
                        ...user,
                        templates: [...user.templatesCreated, ...forAllTemplates],
                    })
                }


            }
        } catch (e) {
            return NextResponse.json({error: e}, {
                status: 403
            });
        }

    }

    return NextResponse.json({error: "Forbidden"}, {
        status: 403
    })

}