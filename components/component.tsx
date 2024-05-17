"use client";

import { LucideIcon } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface ComponentProps {
    data: {
        title: string;
        icon: LucideIcon;
    };
    index: number;
}

const Component = ({ data: { icon: Icon, title }, index }: ComponentProps) => {
    return (
        <Draggable draggableId={title} index={index}>
            {(draggableProvided, draggableSnapshot) => (
                <div
                    className="h-16 border flex justify-center items-center"
                    {...draggableProvided.dragHandleProps}
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                >
                    <div className="bg-gray-200 h-full w-16 flex justify-center items-center mr-3">
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="flex-1 text-lg">{title}</h3>
                </div>
            )}
        </Draggable>
    );
};

export default Component;
