// lib/fonts.ts
import { Archivo } from "next/font/google";

// Variable font with the width axis, so the hero sentence can be set condensed.
// "latin-ext" is required: Google's plain "latin" subset doesn't include the peso sign (U+20B1).
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});
