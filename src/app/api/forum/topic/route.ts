import {userAccess} from "@/utils/access-control/access-api";
import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import {checkForumUser} from "@/libs/forum-libs/check-user";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
    const user = await userAccess("topics.access")

    if (user) {

        const prisma = new PrismaClient()

        const topics = await prisma.topic.findMany({
            where: {
                createdId: user.id
            },
            orderBy: {
                id: "desc"
            },
        })

        return NextResponse.json(topics)

    }

    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })
}

export async function POST(req: Request) {
    const user = await userAccess("topics.access")
    const body = await req.json()

    if (!body || !/\?[a-z]=\d+/g.test(body.url) || !body.url.startsWith("https://lssd.gtaw.me")) {
        return NextResponse.json({
            error: "Invalid URL"
        }, {
            status: 400
        })
    }



    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    })
    const page = await browser.newPage();

    try {
        if (user) {
            // @ts-ignore
            const account = await checkForumUser(user)

            const prisma = new PrismaClient()

            await page.setDefaultNavigationTimeout(120000);

            await page.setRequestInterception(true);

            page.on('request', (req) => {
                if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            console.log(account)

            await page.setCookie({
                name: "phpbb3_enlax_sid",
                // @ts-ignore
                value: account.sid,
                domain: ".lssd.gtaw.me"
            })


            // @ts-ignore
            await page.goto(`https://lssd.gtaw.me/viewtopic.php${/\?[a-z]=\d+/g.exec(body.url)[0]}/}`, {waitUntil: 'domcontentloaded'});

            const author = await page.evaluate(el => el && el.textContent?.replaceAll("\n",""), await page.$('.postprofile > dt'))
            // @ts-ignore
            const answers = /\d+/g.exec((await page.evaluate(el => el && el.textContent, await page.$('.pagination')))) || 0


            await page.screenshot({
                path: 'screenshot.png',
                fullPage: true
            })

            if (!author || !answers)
                return NextResponse.json({error: "Not Found"}, {
                    status: 404
                });


            if (await page.evaluate(el => el && el.textContent, await page.$('textarea[name="message"]')))
                return NextResponse.json({error: "Cannot send message"}, {
                    status: 406
                });


            const topic = await prisma.topic.create({
                data: {
                    name: body.name,
                    // @ts-ignore
                    topicId: /\?[a-z]=\d+/g.exec(body.url)[0],
                    createdId: user.id,
                    pages: Math.ceil((+answers) / 10),
                    answers: (+answers) - 1,
                    forumUserCreated: author
                }
            })


            await browser.close()
            await browser.disconnect()


            return NextResponse.json(topic);
        }
    } catch (e) {
        console.log(e)
        await browser.close()
        await browser.disconnect()
    } finally {
        await browser.close()
        await browser.disconnect()
    }

    return NextResponse.json({
        error: "Forbidden"
    }, {
        status: 403
    })
}