import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();

        // Check if user is logged in
        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        const form = await db.form.create({
            data: {
                userId: userId!,
                title: "Untitled",
            },
        });

        return NextResponse.json({ message: "Form Created Successfully" });
    } catch (error) {
        console.log("[CREATE_FORM_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
