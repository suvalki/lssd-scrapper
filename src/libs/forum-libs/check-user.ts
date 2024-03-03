import {User} from "@/types/users/user";
import {PrismaClient} from "@prisma/client";
import puppeteer from "puppeteer";

export const checkForumUser = async (user: User) => {

    const prisma = new PrismaClient()

    const accounts = await prisma.user.findFirst({
        where: {
            id: user.id
        },
        select: {
            forumAccounts: true
        },
    })
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    })
    try {
        if (accounts) {
            const active = accounts.forumAccounts.filter(account => account.active)[0]

            if (active) {


                const page = await browser.newPage();

                await page.setDefaultNavigationTimeout(120000);


                await page.setCookie({
                    name: "phpbb3_enlax_sid",
                    // @ts-ignore
                    value: active.sid,
                    domain: ".lssd.gtaw.me"
                })

                console.log("Logged in 1")

                await page.setRequestInterception(true);

                // Intercept requests and block certain resource types
                page.on('request', (req) => {
                    if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });



                await page.goto("\n" +
                    "https://lssd.gtaw.me/ucp.php?i=ucp_attachments&mode=attachments", {waitUntil: 'domcontentloaded'});


                if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a'))) {


                    await browser.close()
                    await browser.disconnect()


                    return active


                } else {
                    await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php", {waitUntil: 'domcontentloaded'});
                    console.log("Goto login")
                    console.log(active)
                    await page.screenshot({
                        path: 'screenshot.png',
                    })

                    await page.locator('input[name="username"]').fill(active.login)
                    await page.locator('input[name="password"]').fill(active.password)
                    await page.locator("input[name='autologin']").click()

                    await page.locator('input[name="login"]').click()

                    await page.waitForNavigation()


                    if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a'))) {
                        const cookie = await page.cookies()
                        
                        const account = await prisma.forumAccount.update({
                            where: {
                                id: active.id
                            },
                            data: {
                                // @ts-ignore
                                sid: cookie.filter((el) => el.name === "phpbb3_enlax_sid")[0].value,
                            }
                        })

                        await browser.close()
                        await browser.disconnect()

                        return account
                    }
                }
            }

        }

    } catch (e) {
        console.log(e)
        await browser.close()
        await browser.disconnect()
    } finally {
        await browser.close()
        await browser.disconnect()
    }
    return false

}

export const checkForumAccount = async (login: string, password: string) => {

    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    })

    try {
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        // Intercept requests and block certain resource types
        page.on('request', (req) => {
            if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php", {waitUntil: 'domcontentloaded'});

        await page.locator('input[name="username"]').fill(login)
        await page.locator('input[name="password"]').fill(password)
        await page.locator("input[name='autologin']").click()

        await page.locator('input[name="login"]').click()

        await page.waitForNavigation()

        if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a'))) {

            const cookie = (await page.cookies()).filter((el) => el.name === "phpbb3_enlax_sid")[0].value
            await browser.close()

            return cookie

        }
        await browser.close()
        await browser.disconnect()
        return false
    } catch (e) {
        console.log(e)
        await browser.close()
        await browser.disconnect()

    } finally {
        await browser.close()
        await browser.disconnect()
    }
    return false
}
