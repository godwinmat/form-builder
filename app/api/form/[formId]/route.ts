import { FormComponent } from "@/hooks/use-form";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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
        });

        if (!form) return new NextResponse("Not Found", { status: 404 });

        await db.form.delete({
            where: {
                id: params.formId,
            },
        });

        return NextResponse.json({ message: "Form Deleted Successfully" });
    } catch (error) {
        console.log("[CREATE_FORM_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { formId: string } }
) {
    try {
        const { userId } = auth();

        // Check if user is logged in
        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        // Find the form by its ID
        const form = await db.form.findUnique({
            where: {
                id: params.formId,
            },
            include: {
                components: true, // Include components in the query result
            },
        });

        if (!form) return new NextResponse("Not Found", { status: 404 });

        const components: FormComponent[] = await request.json();

        const newComponentsArray = components.map((components) => ({
            ...components,
            formId: params.formId,
        }));

        if (form.components.length > 0) {
            await db.component.deleteMany({
                where: {
                    formId: params.formId,
                },
            });
        }

        if (newComponentsArray.length > 0) {
            await db.component.createMany({
                data: newComponentsArray,
            });
        }

        newComponentsArray.map(async (newComponent) => {
            if (newComponent.type === "heading") {
                await db.form.update({
                    where: {
                        id: params.formId,
                    },
                    data: {
                        title: newComponent.value,
                    },
                });
            }
        });

        return NextResponse.json({ message: "Form Updated Successfully" });
    } catch (error) {
        console.log("[CREATE_FORM_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
