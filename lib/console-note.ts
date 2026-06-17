const BOX_WIDTH = 67;

function boxRow(text: string): string {
  const trimmed = text.slice(0, BOX_WIDTH);
  if (trimmed.length >= BOX_WIDTH) return trimmed;
  const pad = BOX_WIDTH - trimmed.length;
  const left = Math.floor(pad / 2);
  return " ".repeat(left) + trimmed + " ".repeat(pad - left);
}

export const ELEMENTS_NOTE_BANNER = [
  `    ╔${"═".repeat(BOX_WIDTH)}╗`,
  `    ║${boxRow("♡  ·  ✦  ·  hi i'm mei!  ·  ✦  ♡  ·")}║`,
  `    ║${boxRow("─".repeat(37))}║`,
  `    ║${boxRow("welcome to my web realm ^_^")}║`,
  `    ║${boxRow("you peeked under the hood, what are you curious about?")}║`,
  `    ╚${"═".repeat(BOX_WIDTH)}╝`,
].join("\n");

export const elementsNoteScript = `
(function () {
  var art = ${JSON.stringify(ELEMENTS_NOTE_BANNER)};
  var comment = document.createComment("\\n" + art + "\\n");
  document.body.insertBefore(comment, document.body.firstChild);
})();
`.trim();

const CONSOLE_NOTE_CUSTOM = `
        ⏔⏔⏔ ꒰ ᧔ෆ᧓ ꒱ ⏔⏔⏔

          (\\  (\\
          („• ֊ •„)   <(here are some funny bunnies...)
         ━━━━O━O━━━━

⠀⠀⠀⠀⠀⠀⠀⢰⣿⠛⠷⡞⠛⢳⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⠛⣷⠾⣻⢷⡆⠂⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⣷⠑⡆⢳⡆⠀⣿⠀⠀⠀⠀⠀⣾⣷⣿⡆⠀⠀⠀⠀⠀⣿⠀⢰⡟⠐⢃⡞⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢅⡹⡈⠿⡀⢹⡇⠀⠀⠀⠀⠀⠙⠋⠀⠀⠀⠀⠀⢹⠉⣀⠏⡽⢁⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⣧⠐⡜⠣⠬⠙⠦⢄⠀⠀⠀⠀⠀⠀⠀⢀⣠⠼⠛⠶⡟⠐⠃⣞⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣤⠛⠛⠛⠛⣤⣍⡏⠁⠀⠀⣀⣀⠈⢻⡄⠀⠀⠀⠀⢠⠟⠁⣀⣄⠀⠀⠈⣿⣩⣤⠛⠛⠛⠻⣤⣀⠀⠀⠀
⠀⣠⡔⠉⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠙⠛⠀⢨⣿⠀⠀⠀⠀⣞⡇⠀⠛⠃⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠹⢧⣀⠀
⢠⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⡟⠀⠀⠀⠀⢣⣤⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄
⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠉⠀⠀⠀⠀⠀⠀⠀⠈⠉⣿⡏⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⣤⣤⣤⠀⠀⠀⣀⠀⣼⠇
⠀⠻⢆⣴⣤⣤⣤⣯⣭⣵⣦⣤⣤⣼⣄⡸⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⣾⣧⣤⣴⣾⣿⣿⣿⣤⣤⣼⣤⡼⠛
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⡀

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⢀⣀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡎⠀⠸⡄⡇⠀⠱⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⡀⠀⢱⢣⠀⠀⡇⠀
⠀⠀⠀⠀⠀⢀⡠⠤⠤⡀⠀⠱⡀⠸⣈⠇⢠⠃⠀
⠀⡠⠤⢄⠔⠁⠀⠀⠀⠈⠉⢢⠃⠀⠀⠀⠫⡀⠀
⢸⠀⢠⠃⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠿⠀⠀⢱⠀
⠈⠣⡇⠀⠀⠀⠉⡆⠀⠀⠀⠀⠀⠀⠀⠀⢲⠈⡆
⠀⠀⢣⠀⠀⠀⢀⠇⠀⠀⠀⠀⠑⠤⣀⣀⣁⡡⠁
⠀⠀⠈⢧⠀⠀⠑⠒⠒⢦⠀⠀⢠⠀⠠⠤⢧⡀⠀
⠀⠀⠀⠀⠓⠒⠦⠤⠤⠜⠒⠒⠚⠦⠤⠤⠤⠃⠀

  /)/)
( . .)
( づ♡`;

const CONSOLE_NOTE_FOOTER = `
         ✦
        /|\\       may the signal stay clear
       / | \\      and the noise fall away
      *  ·  *
         |
    ·  · ♡ ·  ·`;

export function formatConsoleNote(): string {
  return [ELEMENTS_NOTE_BANNER, CONSOLE_NOTE_CUSTOM, CONSOLE_NOTE_FOOTER]
    .map((block) => block.trim())
    .join("\n\n");
}
