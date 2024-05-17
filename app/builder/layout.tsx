"use client";

import Navbar from "@/components/navbar";
import MainSidebar from "@/components/main-side-bar";
import {
    DragStart,
    DragUpdate,
    DropResult,
    DragDropContext,
} from "@hello-pangea/dnd";
import { useFormComponents } from "@/hooks/use-form";
import { generateId } from "@/lib/utils";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setFormComponents, components, formComponents } =
        useFormComponents();

    // function onDragStart(result: DragStart) {
    //     const { source, type } = result;
    // }

    // function onDragUpdate(result: DragUpdate) {
    //     const { source, destination } = result;
    // }

    function onDragEnd(result: DropResult) {
        const { source, destination } = result;

        if (!destination || !source) return;
        if (
            source.droppableId === "sidebar" &&
            destination.droppableId === "sidebar"
        )
            return;

        let localComponents = components;
        let localFormComponents = formComponents;

        if (
            source.droppableId === "form" &&
            destination.droppableId === "form"
        ) {
            const [draggedComponent] = localFormComponents.splice(
                source.index,
                1
            );
            localFormComponents.splice(destination.index, 0, draggedComponent);
            setFormComponents(localFormComponents);
        }

        if (source.droppableId !== destination.droppableId) {
            if (
                source.droppableId === "sidebar" &&
                destination.droppableId === "form"
            ) {
                const draggedComponent = localComponents.find(
                    (component, index) => index === source.index
                );
                localFormComponents.splice(destination.index, 0, {
                    id: generateId(),
                    type: draggedComponent?.type!,
                    editing: false,
                });
                setFormComponents(localFormComponents);
            } else if (
                source.droppableId === "form" &&
                destination.droppableId === "sidebar"
            ) {
                localFormComponents.splice(source.index, 1);
                setFormComponents(localFormComponents);
            }
        }
    }

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
            // onDragStart={onDragStart}
            // onDragUpdate={onDragUpdate}
        >
            <div className="hidden h-full md:flex md:w-[380px] md:flex-col md:fixed md:inset-y-0 border-r">
                <MainSidebar />
            </div>
            <main className="md:pl-[380px]">
                <div className="relative text-default pb-1 h-[calc(100dvh_-_64px)] flex flex-col items-center">
                    {children}
                </div>
            </main>
        </DragDropContext>
    );
}
