import {NextResponse} from "next/server";
import puppeteer from "puppeteer";

import {noTemplateFormSchema} from "@/schemas/send-forms";
import {InferType} from "yup";
import {userAccess} from "@/utils/access-control/access-api";
import {checkForumUser} from "@/libs/forum-libs/check-user";

export async function POST(request: Request) {
    const user = await userAccess()
    const body = await request.json()

    if (user && body) {

        // @ts-ignore
        const account = await checkForumUser(user)

        const browser = await puppeteer.launch({
            args: ["--no-sandbox"]
        });
        const page = await browser.newPage();

        // await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php");

        await page.setCookie({
            name: "phpbb3_enlax_sid",
            // @ts-ignore
            value: account.sid,
            domain: ".lssd.gtaw.me"
        })

        await page.goto("https://lssd.gtaw.me/ucp.php?i=pm&mode=compose");

        if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a > .username-coloured'))) {
            await page.locator("textarea[name='username_list']").fill(body.recipients)
            await page.locator("input[name='add_to']").click()

            await page.waitForNavigation()

            if (await page.evaluate(el => el && el.textContent, await page.$('.error'))) {
                return NextResponse.json({error: "Recipient not found"}, {
                    status: 404
                });
            }

            await page.locator("input[name='subject']").fill(body.subject)
            await page.locator("textarea[name='message']").fill(body.message)

            await page.locator("input[name='post']").click()

            await page.waitForNavigation()

            return NextResponse.json({success: "Message sent"});
        }
    }
    return NextResponse.json({error: "Forbidden"}, {
        status: 403
    });

}