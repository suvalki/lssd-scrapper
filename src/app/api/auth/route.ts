import {InferType} from "yup";
import {NextResponse} from "next/server";
import {LoginFormSchema} from "@/schemas/login-forms";
import {PrismaClient} from "@prisma/client";
import {sanitizer} from "@/libs/prisma-libs/sanitizer";
// @ts-ignore
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";

export async function POST(req: Request, res: Response) {

    const prisma = new PrismaClient()

    const data = (await req.json() as InferType<typeof LoginFormSchema>);
    try {
        await LoginFormSchema.validateSync(data)
    } catch (e) {
        return NextResponse.json({error: e}, {
            status: 403
        });
    }

    const user = await prisma.user.findFirst({
        where: {
            login: data.login,
            password: data.password
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

        const token = jwt.sign({
            id: user.id
        }, "lssd-scrapper-2024", {expiresIn: "1d"});

        cookies().set("token", token)

        return NextResponse.json(sanitizer("user", {...user, token: token}))


    }

    return NextResponse.json({message: "User Not Found"}, {
        status: 404
    });
}