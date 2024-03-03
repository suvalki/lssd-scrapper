import {NextResponse} from "next/server";
import puppeteer from "puppeteer";
import {userAccess} from "@/utils/access-control/access-api";
import {checkForumUser} from "@/libs/forum-libs/check-user";

export async function POST(request: Request) {
    const user = await userAccess()
    const body = await request.json()
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    });
    try {
        if (user && body) {
            const start = (new Date()).getSeconds()



            // @ts-ignore
            const account = await checkForumUser(user)


            const page = await browser.newPage();


            // await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php");

            await page.setDefaultNavigationTimeout(120000);

            await page.setRequestInterception(true);

            // Intercept requests and block certain resource types
            page.on('request', (req) => {
                if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.setCookie({
                name: "phpbb3_enlax_sid",
                // @ts-ignore
                value: account.sid,
                domain: ".lssd.gtaw.me"
            })

            await page.goto("https://lssd.gtaw.me/ucp.php?i=pm&mode=compose", {waitUntil: 'domcontentloaded'});


            await page.locator("textarea[name='username_list']").fill(body.recipients)
            await page.locator("input[name='add_to']").click()

            await page.waitForSelector("input[name='subject']")

            if (await page.evaluate(el => el && el.textContent, await page.$('.error'))) {

                await browser.close()
                await browser.disconnect()

                console.log(`couple time - ${(start - (new Date()).getSeconds())* -1} sec`)

                return NextResponse.json({error: "Recipient not found"}, {
                    status: 404
                });
            }

            await page.locator("input[name='subject']").fill(body.subject)
            await page.locator("textarea[name='message']").fill(body.message)

            await page.locator("input[name='post']").click()

            await page.waitForSelector(".header-profile > a")

            await browser.close()
            await browser.disconnect()

            console.log(`couple time - ${(start - (new Date()).getSeconds())* -1} sec`)

            return NextResponse.json({success: "Message sent"});
        }
    } catch (e) {
        console.log(e)
        await browser.close()
        await browser.disconnect()
    } finally {
        await browser.close()
        await browser.disconnect()
    }

    return NextResponse.json({error: "Forbidden"}, {
        status: 403
    });

}