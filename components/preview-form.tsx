"use client";

import { Component } from "@prisma/client";
import { useState } from "react";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormMessage } from "./ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
    firstname: z.string().min(0).max(50, "Character cannot be greater than 50"),
    lastname: z.string().min(0).max(50, "Character cannot be greater than 50"),
    phone: z.string().min(0),
    email: z.string().min(0),
    gender: z.string().min(0),
    date: z.date(),
});

interface PreviewFormProps {
    components: Component[];
    formId: string;
}

const PreviewForm = ({ components, formId }: PreviewFormProps) => {
    console.log(components);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            gender: "",
            date: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const res = await fetch(`/api/prospects/${formId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
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
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="border rounded-lg w-full md:w-auto md:min-w-[400px] py-10 px-3 md:px-10 overflow-y-scroll flex flex-col space-y-3"
            >
                {components.length === 0 && (
                    <p className="text-center font-semibold text-3xl text-muted-foreground">
                        No component to display
                    </p>
                )}
                {components.map(({ id, type, value }, index) => {
                    if (type === "heading") {
                        return (
                            <h2 className="text-3xl font-bold text-center">
                                {value}
                            </h2>
                        );
                    } else if (type === "subheading") {
                        return (
                            <h2 className="text-2xl font-semibold text-center">
                                {value}
                            </h2>
                        );
                    } else if (type === "description") {
                        return (
                            <h2 className="text-lg font-medium text-center">
                                {value}
                            </h2>
                        );
                    } else if (type === "fullname") {
                        return (
                            <div className="flex space-x-3 w-full">
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <div className="flex-1/2">
                                            <Input
                                                id="firstname"
                                                className="h-[52px] text-base px-4"
                                                placeholder="Enter your first name"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <div className="flex-1/2">
                                            <Input
                                                id="lastname"
                                                className="h-[52px] text-base px-4"
                                                placeholder="Enter your last name"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                            </div>
                        );
                    } else if (type === "phone") {
                        return (
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="h-[52px] text-base px-4"
                                            placeholder="Enter your phone number"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </>
                                )}
                            />
                        );
                    } else if (type === "email") {
                        return (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="h-[52px] text-base px-4"
                                            placeholder="Enter your email address"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </>
                                )}
                            />
                        );
                    } else if (type === "gender") {
                        return (
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            form.setValue("gender", value);
                                        }}
                                    >
                                        <SelectTrigger className="w-full h-[52px] text-base text-muted-foreground">
                                            {field.value ? (
                                                <p className="text-black">
                                                    {capitalizeFirstLetter(
                                                        field.value
                                                    )}
                                                </p>
                                            ) : (
                                                <SelectValue placeholder="Gender" />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value="male"
                                                className="h-12 cursor-pointer"
                                            >
                                                Male
                                            </SelectItem>
                                            <SelectItem
                                                value="female"
                                                className="h-12 cursor-pointer"
                                            >
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        );
                    } else if (type === "calendar") {
                        return (
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger
                                            className="w-full text-base"
                                            asChild
                                        >
                                            <Button
                                                variant={"outline"}
                                                type="button"
                                                className={cn(
                                                    "w-full h-[52px] justify-start text-left"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <>
                                                        <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                                                        <span className="text-base text-muted-foreground">
                                                            Pick a date
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    form.setValue(
                                                        "date",
                                                        date!
                                                    );
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        );
                    } else if (type === "submit") {
                        return (
                            <Button
                                type="submit"
                                className="w-full h-12 text-base"
                                disabled={loading}
                            >
                                Submit
                            </Button>
                        );
                    }
                })}
            </form>
        </Form>
    );
};

export default PreviewForm;
