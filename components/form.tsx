"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormComponent, useFormComponents } from "@/hooks/use-form";
import {
    CalendarIcon,
    Check,
    GripVertical,
    Loader2,
    Pencil,
    X,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Component, Form } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePreview } from "@/hooks/use-preview";

interface FormProps {
    components: Component[];
    formId: string;
    formTitle: string;
}

const FormBuilder = ({ components, formId, formTitle }: FormProps) => {
    const { formComponents, setFormComponents } = useFormComponents();
    const { preview } = usePreview();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const newComponents = components.map(({ formId, ...rest }) => rest);
        const modifiedComponent = newComponents.map(
            (component) =>
                ({
                    ...component,
                    editing: false,
                    value: component.value!,
                } as FormComponent)
        );

        setFormComponents(modifiedComponent);
    }, []);

    const [date, setDate] = useState<Date>();

    async function save() {
        try {
            setLoading(true);
            const res = await fetch(`/api/form/${formId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    formComponents.map(({ editing, ...rest }) => rest)
                ),
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

    function toggleEdit(id: string) {
        const newFormComponents = formComponents.map((formComponent) => {
            if (formComponent.id === id) {
                return {
                    ...formComponent,
                    editing: !formComponent.editing,
                };
            }
            return formComponent;
        });
        setFormComponents(newFormComponents);
    }

    function onValueChange(id: string, value: string) {
        const newFormComponents = formComponents.map((formComponent) => {
            if (formComponent.id === id) {
                return {
                    ...formComponent,
                    value,
                };
            }
            return formComponent;
        });
        setFormComponents(newFormComponents);
    }

    function removeComponent(index: number) {
        let localFormComponents = formComponents;

        localFormComponents.splice(index, 1);

        setFormComponents(localFormComponents);
    }

    return (
        <Droppable droppableId="form" direction="vertical">
            {(droppableProvided) => (
                <div
                    className="border rounded-lg w-full md:w-auto md:min-w-[400px] py-10 px-2 md:px-10 overflow-y-scroll"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                >
                    {formComponents.length === 0 && !preview && (
                        <h1 className="text-2xl text-muted-foreground text-center">
                            Drag and Drop a Component into this box
                        </h1>
                    )}

                    {preview && formComponents.length === 0 && (
                        <h1 className="text-2xl text-muted-foreground text-center">
                            Form is empty
                        </h1>
                    )}

                    <div className="space-y-4">
                        {formComponents.map(
                            ({ id, type, editing, value }, index) => {
                                if (type === "heading") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex justify-center items-center space-x-2 mb-6"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <div>
                                                        {editing ? (
                                                            <div className="flex justify-center items-center space-x-1">
                                                                <Input
                                                                    placeholder="Edit heading"
                                                                    className="w-48"
                                                                    onKeyDown={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            "Enter"
                                                                        ) {
                                                                            toggleEdit(
                                                                                id
                                                                            );
                                                                        }
                                                                    }}
                                                                    onChange={({
                                                                        target: {
                                                                            value,
                                                                        },
                                                                    }) =>
                                                                        onValueChange(
                                                                            id,
                                                                            value
                                                                        )
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        toggleEdit(
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="w-5 h-5 text-muted-foreground" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <h2 className="text-3xl font-bold text-center">
                                                                {value ||
                                                                    formTitle}
                                                            </h2>
                                                        )}
                                                    </div>
                                                    {!preview && !editing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                toggleEdit(id)
                                                            }
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "subheading") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex justify-center items-center space-x-2"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <div>
                                                        {editing ? (
                                                            <div className="flex justify-center items-center space-x-1">
                                                                <Input
                                                                    placeholder="Edit subheading"
                                                                    className="w-48"
                                                                    onKeyDown={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            "Enter"
                                                                        ) {
                                                                            toggleEdit(
                                                                                id
                                                                            );
                                                                        }
                                                                    }}
                                                                    onChange={({
                                                                        target: {
                                                                            value,
                                                                        },
                                                                    }) =>
                                                                        onValueChange(
                                                                            id,
                                                                            value
                                                                        )
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        toggleEdit(
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="w-5 h-5 text-muted-foreground" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <h2 className="text-2xl font-semibold text-center">
                                                                {value ||
                                                                    "Subheading"}
                                                            </h2>
                                                        )}
                                                    </div>
                                                    {!preview && !editing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                toggleEdit(id)
                                                            }
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "description") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex justify-center items-center space-x-2 w-full"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <div>
                                                        {editing ? (
                                                            <div className="flex justify-center items-center space-x-1">
                                                                <Input
                                                                    placeholder="Edit description"
                                                                    onKeyDown={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            "Enter"
                                                                        ) {
                                                                            toggleEdit(
                                                                                id
                                                                            );
                                                                        }
                                                                    }}
                                                                    onChange={({
                                                                        target: {
                                                                            value,
                                                                        },
                                                                    }) =>
                                                                        onValueChange(
                                                                            id,
                                                                            value
                                                                        )
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        toggleEdit(
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="w-5 h-5 text-muted-foreground" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <h2 className="text-lg font-medium text-center">
                                                                {value ||
                                                                    "Description"}
                                                            </h2>
                                                        )}
                                                    </div>
                                                    {!preview && !editing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                toggleEdit(id)
                                                            }
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "fullname") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex items-end space-x-2 w-full"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="h-12 flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-7 h-7 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <div className="flex space-x-3 w-full">
                                                        <div className="flex-1/2">
                                                            <Input
                                                                id="firstname"
                                                                type="tel"
                                                                className="h-[52px] text-base px-4"
                                                                placeholder="Enter your first name"
                                                            />
                                                        </div>
                                                        <div className="flex-1/2">
                                                            <Input
                                                                id="lastname"
                                                                type="tel"
                                                                className="h-[52px] text-base px-4"
                                                                placeholder="Enter your last name"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "phone") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex items-end space-x-2 w-full"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="h-12 flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-7 h-7 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <div className="flex-1">
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            className="h-[52px] text-base px-4"
                                                            placeholder="Enter your phone number"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "email") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex items-end space-x-2 w-full"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="h-12 flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-7 h-7 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <div className="flex-1">
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            className="h-[52px] text-base px-4"
                                                            placeholder="Enter your email address"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "gender") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <Select>
                                                    <div
                                                        className="flex items-end space-x-2 w-full"
                                                        ref={
                                                            draggableProvided.innerRef
                                                        }
                                                        {...draggableProvided.draggableProps}
                                                    >
                                                        {!preview && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                {...draggableProvided.dragHandleProps}
                                                                className="h-12 flex justify-center items-center"
                                                                onDoubleClick={() =>
                                                                    removeComponent(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <GripVertical className="w-7 h-7 text-muted-foreground" />
                                                            </Button>
                                                        )}
                                                        <SelectTrigger className="w-full h-[52px] text-base text-muted-foreground">
                                                            <SelectValue placeholder="Gender" />
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
                                                    </div>
                                                </Select>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "calendar") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <Popover>
                                                    <div
                                                        className="flex items-end space-x-2 w-full"
                                                        ref={
                                                            draggableProvided.innerRef
                                                        }
                                                        {...draggableProvided.draggableProps}
                                                    >
                                                        {!preview && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                {...draggableProvided.dragHandleProps}
                                                                className="h-12 flex justify-center items-center"
                                                                onDoubleClick={() =>
                                                                    removeComponent(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <GripVertical className="w-7 h-7 text-muted-foreground" />
                                                            </Button>
                                                        )}
                                                        <PopoverTrigger className="w-full text-base text-muted-foreground">
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
                                                                className={cn(
                                                                    "w-full h-[52px] justify-start text-left",
                                                                    !date &&
                                                                        "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-5 w-5" />
                                                                {date ? (
                                                                    format(
                                                                        date,
                                                                        "PPP"
                                                                    )
                                                                ) : (
                                                                    <span className="text-base">
                                                                        Pick a
                                                                        date
                                                                    </span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date}
                                                                onSelect={
                                                                    setDate
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </div>
                                                </Popover>
                                            )}
                                        </Draggable>
                                    );
                                } else if (type === "submit") {
                                    return (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={preview}
                                            disableInteractiveElementBlocking={
                                                true
                                            }
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => (
                                                <div
                                                    className="flex justify-center items-center space-x-2 w-full"
                                                    ref={
                                                        draggableProvided.innerRef
                                                    }
                                                    {...draggableProvided.draggableProps}
                                                >
                                                    {!preview && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            {...draggableProvided.dragHandleProps}
                                                            className="h-12 flex justify-center items-center"
                                                            onDoubleClick={() =>
                                                                removeComponent(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="w-7 h-7 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        className="w-full h-12 text-base"
                                                        disabled={true}
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                }
                            }
                        )}
                    </div>

                    {droppableProvided.placeholder}
                    {!preview && (
                        <div className="w-full flex justify-center mt-10">
                            <Button onClick={save} disabled={loading}>
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <span>Save</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Droppable>
    );
};

export default FormBuilder;
