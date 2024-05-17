import {
    Calendar,
    Check,
    Heading1,
    Heading3,
    LucideIcon,
    Mail,
    PersonStanding,
    Phone,
    Text,
    User,
} from "lucide-react";
import { create } from "zustand";

export interface FormComponent {
    id: string;
    type:
        | "heading"
        | "subheading"
        | "description"
        | "fullname"
        | "email"
        | "gender"
        | "calendar"
        | "phone"
        | "submit";
    value?: string | undefined;
    editing: boolean;
}

interface Component {
    type:
        | "heading"
        | "subheading"
        | "description"
        | "fullname"
        | "email"
        | "gender"
        | "calendar"
        | "phone"
        | "submit";
    icon: LucideIcon;
}

interface useFormComponentsStore {
    components: Component[];
    formComponents: FormComponent[];
    setFormComponents: (components: FormComponent[]) => void;
}

const components: Component[] = [
    {
        type: "heading",
        icon: Heading1,
    },
    {
        type: "subheading",
        icon: Heading3,
    },
    {
        type: "description",
        icon: Text,
    },
    {
        type: "fullname",
        icon: User,
    },
    {
        type: "phone",
        icon: Phone,
    },
    {
        type: "email",
        icon: Mail,
    },
    {
        type: "gender",
        icon: PersonStanding,
    },
    {
        type: "calendar",
        icon: Calendar,
    },
    {
        type: "submit",
        icon: Check,
    },
];

export const useFormComponents = create<useFormComponentsStore>((set) => ({
    components,
    formComponents: [],
    setFormComponents: (formComponents) =>
        set({
            formComponents,
        }),
}));
