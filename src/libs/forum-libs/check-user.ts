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

    if (accounts) {
        const active = accounts.forumAccounts.filter(account => account.active)[0]
        if (active) {
            const browser = await puppeteer.launch({
                args: ["--no-sandbox"]
            })

            const page = await browser.newPage();

            page.setCookie({
                name: "phpbb3_enlax_sid",
                // @ts-ignore
                value: active.sid,
                domain: ".lssd.gtaw.me"
            })

            console.log(active)

            await page.goto("https://lssd.gtaw.me/index.php");

            if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a > .username-coloured'))) {
                return active
            }
            else {
                await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php");

                await page.locator('input[name="username"]').fill(active.login)
                await page.locator('input[name="password"]').fill(active.password)
                await page.locator("input[name='autologin']").click()

                await page.locator('input[name="login"]').click()

                await page.waitForNavigation()

                if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a > .username-coloured'))) {
                    const cookie = await page.cookies()
                    const account = await prisma.forumAccount.update({
                        where: {
                            id: active.id
                        },
                        data: {
                            // @ts-ignore
                            sid: cookie.filter((el) => el.name === "phpbb3_enlax_sid")[0].value
                        }
                    })

                    return account
                }
            }
        }

    }
    return false

}

export const checkForumAccount = async (login: string, password: string) => {

    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    })

    const page = await browser.newPage();

    await page.goto("https://lssd.gtaw.me/ucp.php?mode=login&redirect=index.php");

    await page.locator('input[name="username"]').fill(login)
    await page.locator('input[name="password"]').fill(password)
    await page.locator("input[name='autologin']").click()

    await page.locator('input[name="login"]').click()

    await page.waitForNavigation()

    if (await page.evaluate(el => el && el.textContent, await page.$('.header-profile > a > .username-coloured'))) {
        return (await page.cookies()).filter((el) => el.name === "phpbb3_enlax_sid")[0].value
    }

    return false

}
