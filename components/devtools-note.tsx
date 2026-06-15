"use client";

import { useEffect } from "react";
import { formatConsoleNote } from "@/lib/console-note";

export function DevToolsNote() {
  useEffect(() => {
    console.log(formatConsoleNote());
  }, []);

  return null;
}
