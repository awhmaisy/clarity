import { ELEMENTS_NOTE_BANNER } from "@/lib/console-note";

export function ElementsNote() {
  return (
    <pre className="devtools-elements-note" hidden aria-hidden="true">
      {ELEMENTS_NOTE_BANNER}
    </pre>
  );
}
