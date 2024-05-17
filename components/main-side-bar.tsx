import { FormComponent, useFormComponents } from "@/hooks/use-form";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { generateId } from "@/lib/utils";
import { usePreview } from "@/hooks/use-preview";

const MainSidebar = () => {
    const { components, formComponents, setFormComponents } =
        useFormComponents();
    const { preview } = usePreview();

    function addComponent(type: string) {
        const newComponent = {
            id: generateId(),
            type: type,
            editing: false,
        } as FormComponent;

        setFormComponents([...formComponents, newComponent]);
    }

    return (
        <div className="px-5 py-4">
            <Link href="/">
                <Button variant="outline" className="mb-20">
                    <ArrowLeft />
                </Button>
            </Link>
            <h1 className="font-bold text-3xl">Form Builder</h1>

            <Droppable droppableId="sidebar">
                {(droppableProvider) => (
                    <div
                        className="mt-5 space-y-3"
                        {...droppableProvider.droppableProps}
                        ref={droppableProvider.innerRef}
                    >
                        {components.map(({ icon: Icon, type }, index) => (
                            <Draggable
                                key={index}
                                draggableId={index.toString()}
                                index={index}
                                isDragDisabled={preview}
                            >
                                {(draggableProvided, draggableSnapshot) => (
                                    <Button
                                        className="h-16 border flex justify-center items-center w-full text-left p-0"
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                        onClick={() => addComponent(type)}
                                        variant="ghost"
                                        disabled={preview}
                                    >
                                        <div className="bg-gray-200 h-full w-16 flex justify-center items-center mr-3">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="flex-1 text-lg">
                                            {type.toUpperCase()}
                                        </h3>
                                    </Button>
                                )}
                            </Draggable>
                        ))}
                        {droppableProvider.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default MainSidebar;
