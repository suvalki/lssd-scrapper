import {NextResponse} from "next/server";
import puppeteer from "puppeteer";

import {noTemplateFormSchema} from "@/schemas/send-forms";
import {InferType} from "yup";

export async function POST(request: Request) {
    const data = (await request.json() as InferType<typeof noTemplateFormSchema>);
    try {
        await noTemplateFormSchema.validateSync(data)
    } catch (e) {
        return NextResponse.json({error: e});
    }


    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    });
    const page = await browser.newPage();

    // await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php");
    // await page.locator("[name='username']").fill("William Foger")
    // await page.locator("[name='password']").fill("19112007lL")
    // await page.locator("[name='autologin']").click()
    //
    // await page.locator("[name='login']").click()

    await page.setCookie({
        name: "phpbb3_enlax_sid",
        value: "7305d73f232b02af7f3f61d2cbe5b97f",
        domain: ".lssd.gtaw.me"
    })

    await page.goto("https://lssd.gtaw.me/")

    // await page.waitForNavigation()

    console.log(await page.cookies())

    await page.screenshot({
        path: "screen.png",
        fullPage: true
    })

    if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a > .username-coloured'))) {
        await page.goto("https://lssd.gtaw.me/ucp.php?i=pm&mode=compose")
        await page.locator("[name='username_list']").fill(data.recipients)
        await page.locator("[name='add_to']").click()
        await page.locator("[name='subject']").fill(data.subject)
        await page.locator("[name='message']").fill(data.message)
        await page.locator("[name='post']").click()

        await page.waitForNavigation()

        return NextResponse.json({code: 200});
    } else {
        return NextResponse.json({error: "User not Auth", code: 403});
    }

}