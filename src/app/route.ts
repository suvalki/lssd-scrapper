import {NextResponse} from "next/server";
import {redirect} from "next/navigation";

export async function GET(request: Request) {
    redirect("/send")
}