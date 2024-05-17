"use client";

import { Component, Form } from "@prisma/client";
import { Button } from "./ui/button";
import { Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormComponents } from "@/hooks/use-form";
import { toast } from "sonner";

interface FormsProps {
    data: Form[];
}

const Forms = ({ data }: FormsProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function createForm() {
        try {
            setLoading(true);
            const res = await fetch(`/api/form`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const { message } = await res.json();

            toast(message);
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function deleteForm(id: string) {
        try {
            setLoading(true);
            const res = await fetch(`/api/form/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const { message } = await res.json();
            toast(message);
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full md:w-auto md:min-w-[500px] rounded-md border py-10 px-2 md:px-5 flex flex-col justify-center items-center">
            <h1 className="font-semibold text-2xl text-center pb-10">Forms</h1>
            <div className="space-y-2 w-full mb-5">
                {data.map((item, index) => (
                    <div
                        key={item.id}
                        className="w-full py-3 px-2 md:px-5 bg-gray-100 rounded-md flex justify-between items-center text-lg font-semibold"
                    >
                        {item.title}
                        <div className="space-x-2">
                            <Link href={`/builder/${item.id}`}>
                                <Button size="icon">
                                    <Pencil className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => deleteForm(item.id)}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Trash className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={createForm} disabled={loading}>
                {loading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <div className="flex">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Form
                    </div>
                )}
            </Button>
        </div>
    );
};

export default Forms;
