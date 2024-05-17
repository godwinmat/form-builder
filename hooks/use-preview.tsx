import { create } from "zustand";

interface usePreviewStore {
    preview: boolean;
    setPreview: (preview: boolean) => void;
}

export const usePreview = create<usePreviewStore>((set) => ({
    preview: false,
    setPreview: (preview) => set({ preview }),
}));
