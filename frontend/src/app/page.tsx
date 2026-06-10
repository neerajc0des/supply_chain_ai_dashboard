
"use client"

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { 
  Settings,
} from "lucide-react";

export default function Home() {
  const {setTheme, resolvedTheme} = useTheme();
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      heloo worldddd

      <Button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="relative p-2 text-sidebar-foreground/70 hover:bg-sidebar-hover-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors cursor-pointer focus-visible:outline-none"
      >
        <Settings className="h-5 w-5" />
        
      </Button>
    </div>
  );
}
