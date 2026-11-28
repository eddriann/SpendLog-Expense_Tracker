// Palette used by SVG drawing code. Tailwind classes elsewhere use the same hex values.
export const C = {
  paper: "#F5F7F3", // page background
  rule: "#D5DDD7", // row rules and chart gridlines
  ink: "#1C2A43", // text, spent line, buttons
  slate: "#5E6D84", // secondary text, budget line
  amber: "#B07A00", // projected to go over (graphics only, not text)
  crimson: "#B3261E", // already over budget
} as const;
