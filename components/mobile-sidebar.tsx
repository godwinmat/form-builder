"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import MainSidebar from "./main-side-bar";

const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-7 h-7" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
                <MainSidebar />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
