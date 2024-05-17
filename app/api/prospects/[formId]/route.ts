import db from "@/lib/db";
import { getObjectWithKeys } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { formId: string } }
) {
    try {
        const { userId } = auth();

        // Check if user is logged in
        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        const form = await db.form.findUnique({
            where: {
                id: params.formId,
            },
            include: {
                components: true,
            },
        });

        // Check if form exists
        if (!form) return new NextResponse("Not Found", { status: 404 });

        let keys: (
            | "firstname"
            | "lastname"
            | "calendar"
            | "phone"
            | "email"
            | "gender"
            | "date"
        )[] = form.components
            .map((component) => {
                if (component.type === "fullname") {
                    return ["firstname", "lastname"];
                } else if (
                    component.type === "calendar" ||
                    component.type === "phone" ||
                    component.type === "email" ||
                    component.type === "gender"
                ) {
                    return component.type;
                }
            })
            .flat()
            .filter(
                (
                    type
                ): type is
                    | "firstname"
                    | "lastname"
                    | "phone"
                    | "email"
                    | "gender"
                    | "date" => type !== undefined
            );

        const formValues = await request.json();

        if (keys.includes("calendar")) {
            let index = keys.indexOf("calendar");

            // Check if "calendar" exists in the array
            if (index !== -1) {
                // Replace "calendar" with "date"
                keys[index] = "date";
            }
        }

        const newFormValues = getObjectWithKeys(keys, formValues);

        await db.prospect.create({
            data: newFormValues,
        });

        return NextResponse.json({ message: "Prospects Added Successfully" });
    } catch (error) {
        console.log("[PROSPECTS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
