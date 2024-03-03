import { userAccess } from "@/utils/access-control/access-api";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { checkForumUser } from "@/libs/forum-libs/check-user";
import puppeteer from "puppeteer";

export async function DELETE(
  req: Request,
  { params: { id } }: { params: { id: number } }
) {
  const user = await userAccess();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  try {
    if (user) {
      // @ts-ignore
      const account = await checkForumUser(user);
      const prisma = new PrismaClient();
      const answer = await prisma.answer.findFirst({
        where: {
          id: +id,
          topic: {
            createdId: +user.id,
          },
        }
      });

      if (!answer) {
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

      await page.goto(
        `https://lssd.gtaw.me/posting.php?mode=soft_delete&p=${answer.answerForumId}`,
        {
          waitUntil: "domcontentloaded",
        }
      );

      if (
        !(await page.$eval('input[name="delete_permanent"]', (el) => el.type))
      ) {
        return NextResponse.json(
          {
            error: "Forbidden",
          },
          {
            status: 403,
          }
        );
      }

      await page.locator("input[name='delete_permanent']").click();

      await page.locator("input[name='confirm']").click();

      await page.waitForNavigation();

      await browser.close();
      await browser.disconnect();

      await prisma.answer.delete({
        where: {
          id: +id,
        },
      });

      return NextResponse.json({
        message: "Success",
      });
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
