import PreviewForm from "@/components/preview-form";
import db from "@/lib/db";
import { notFound } from "next/navigation";

interface PreviewProps {
    params: {
        id: string;
    };
}

const Preview = async ({ params: { id } }: PreviewProps) => {
    const form = await db.form.findUnique({
        where: {
            id,
        },
        include: {
            components: true,
        },
    });

    if (!form) {
        notFound();
    }
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <PreviewForm components={form.components} formId={form.id} />
        </div>
    );
};

export default Preview;
