import FormBuilder from "@/components/form";
import Navbar from "@/components/navbar";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface BuilderProps {
    params: {
        formId: string;
    };
}

export default async function Builder({ params: { formId } }: BuilderProps) {
    const { userId } = auth();

    if (!userId) {
        return <RedirectToSignIn />;
    }

    const form = await db.form.findUnique({
        where: {
            id: formId,
            userId: userId!,
        },
        include: {
            components: true,
        },
    });

    if (!form) {
        notFound();
    }
    const shareUrl = `${process.env.PUBLIC_URL}/preview/${formId}`;

    return (
        <main className="relative h-full w-full ">
            <Navbar formTitle={form.title} shareUrl={shareUrl} />
            <div className="flex flex-col justify-center items-center container h-full py-20">
                <FormBuilder
                    formId={formId}
                    formTitle={form.title}
                    components={form.components}
                />
            </div>
        </main>
    );
}
