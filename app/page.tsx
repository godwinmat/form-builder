import Forms from "@/components/forms";
import db from "@/lib/db";
import { RedirectToSignIn, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
    const { userId } = auth();

    if (!userId) {
        return <RedirectToSignIn />;
    }

    const forms = await db.form.findMany({
        where: {
            userId: userId!,
        },
    });

    return (
        <main className="h-full">
            <nav className="flex justify-between items-center px-10 py-3">
                <h1 className="font-semibold text-xl">Form Builder</h1>
                <UserButton />
            </nav>
            <div className="flex h-full justify-center items-center">
                <Forms data={forms} />
            </div>
        </main>
    );
}
