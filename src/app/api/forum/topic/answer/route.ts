import { userAccess } from "@/utils/access-control/access-api";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { checkForumUser } from "@/libs/forum-libs/check-user";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  const user = await userAccess();
  const body = await req.json();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  try {
    if (user && body) {
      // @ts-ignore
      const account = await checkForumUser(user);
      const prisma = new PrismaClient();
      const topic = await prisma.topic.findFirst({
        where: {
          id: +body.topic,
          createdId: user.id,
        },
      });

      if (!topic) {
        return NextResponse.json(
          {
            error: "Forbidden",
          },
          {
            status: 403,
          }
        );
      }

      const page = await browser.newPage();

      await page.setDefaultNavigationTimeout(120000);

      await page.setRequestInterception(true);

      // Intercept requests and block certain resource types
      page.on("request", (req) => {
        if (
          req.resourceType() === "stylesheet" ||
          req.resourceType() === "font" ||
          req.resourceType() === "image"
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.setCookie({
        name: "phpbb3_enlax_sid",
        // @ts-ignore
        value: account.sid,
        domain: ".lssd.gtaw.me",
      });

      await page.goto(`https://lssd.gtaw.me/viewtopic.php${topic.topicId}}/`, {
        waitUntil: "domcontentloaded",
      });


      await page.locator("textarea[name='message']").fill(body.message);

      await page.locator("input[name='post']").click();

      await page.waitForNavigation();

      // @ts-ignore
      const answerId = await page.$$eval('.postbody > div > h3 > a', (el) => /\d+/g.exec(/\?[a-z]=\d+/g.exec(el.at(-1).href.split('/').slice(-1)[0])[0])[0])

      console.log(answerId)

      await browser.close();
      await browser.disconnect();

      const answer = await prisma.answer.create({
        data: {
          name: body.name,
          topicId: +body.topic,
          answerForumId: answerId
        }
      })

      return NextResponse.json(answer);
    }
  } catch (e) {
    console.log(e);
    await browser.close();
    await browser.disconnect();
  } finally {
    await browser.close();
    await browser.disconnect();
  }

  return NextResponse.json(
    { error: "Forbidden" },
    {
      status: 403,
    }
  );
}
