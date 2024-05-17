"use client";

import React, { useState } from "react";
import MobileSidebar from "./mobile-sidebar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { usePreview } from "@/hooks/use-preview";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface NavbarProps {
    formTitle: string;
    shareUrl: string;
}

const Navbar = ({ formTitle, shareUrl }: NavbarProps) => {
    const { preview, setPreview } = usePreview();

    function onCopy() {
        navigator.clipboard.writeText(shareUrl);

        toast("Link Copied Successfully");
    }

    return (
        <div className="flex items-center justify-between px-5 h-16 border-b">
            <MobileSidebar />

            {!preview ? (
                <h1 className="text-lg md:text-2xl font-semibold ml-1 md:ml-3">
                    {formTitle}
                </h1>
            ) : (
                <div className="flex justify-center items-center bg-muted space-x-2 rounded-md pl-2 ml-3 md:ml-0 md:mr-20 w-[200px] lg:w-auto">
                    <p className="text-sm overflow-ellipsis line-clamp-1">
                        {shareUrl}
                    </p>
                    <Button size="icon" className="text-xs h-8 px-2">
                        <Copy className="w-4 h-4" onClick={onCopy} />
                    </Button>
                </div>
            )}

            <div className="ml-auto flex items-center space-x-1 md:space-x-2">
                <Switch
                    id="preview"
                    checked={preview}
                    onCheckedChange={setPreview}
                />
                <Label
                    htmlFor="preview"
                    className="text-sm sm:text-base font-medium"
                >
                    Preview
                </Label>
            </div>
        </div>
    );
};

export default Navbar;
