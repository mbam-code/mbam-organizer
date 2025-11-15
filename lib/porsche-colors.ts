/**
 * Porsche Motorsport Design System Colors
 *
 * A unified color palette inspired by Porsche's motorsport heritage.
 * These values are the single source of truth for the entire application.
 *
 * Usage:
 * - In CSS: Use CSS variables defined in globals.css (--primary, --background, etc.)
 * - In JavaScript: Import from this file for color constants
 * - In Tailwind: Extended theme uses CSS variables
 */

export const PORSCHE_COLORS = {
  // Brand core
  black: "#000000",
  white: "#FFFFFF",

  // Porsche primary red
  red: "#B12B28", // Official Porsche red
  redBright: "#D5001C", // Bright motorsport red (for alerts/destructive)

  // Porsche accent gold
  yellow: "#F7E731", // Bright yellow accent
  gold: "#EBD698", // Warm gold for secondary accents

  // Greyscale
  grey900: "#121212", // Near black (dark mode background)
  grey800: "#1B1B1B", // Dark grey (dark mode card)
  grey700: "#232323", // Medium-dark grey
  grey500: "#464C47", // Medium grey (borders, muted)
  grey200: "#C8C8C8", // Light grey
  grey100: "#F5F5F5", // Very light grey (light mode background/card)
} as const;

/**
 * Light Mode Semantic Tokens
 * These map Porsche colors to semantic roles for light backgrounds
 */
export const LIGHT_MODE_TOKENS = {
  background: PORSCHE_COLORS.grey100, // Card/section backgrounds
  foreground: PORSCHE_COLORS.black, // Primary text

  card: PORSCHE_COLORS.white,
  cardForeground: PORSCHE_COLORS.grey800,

  popover: PORSCHE_COLORS.white,
  popoverForeground: PORSCHE_COLORS.grey800,

  border: PORSCHE_COLORS.grey200,
  input: PORSCHE_COLORS.grey100,

  muted: PORSCHE_COLORS.grey500,
  mutedForeground: PORSCHE_COLORS.grey100,

  primary: PORSCHE_COLORS.red,
  primaryForeground: PORSCHE_COLORS.white,

  secondary: PORSCHE_COLORS.grey500,
  secondaryForeground: PORSCHE_COLORS.white,

  accent: PORSCHE_COLORS.yellow,
  accentForeground: PORSCHE_COLORS.black,

  destructive: PORSCHE_COLORS.redBright,
  destructiveForeground: PORSCHE_COLORS.white,

  ring: PORSCHE_COLORS.red, // Focus rings use red instead of blue
} as const;

/**
 * Dark Mode Semantic Tokens
 * These map Porsche colors to semantic roles for dark backgrounds
 */
export const DARK_MODE_TOKENS = {
  background: PORSCHE_COLORS.grey900, // Deep dark background
  foreground: PORSCHE_COLORS.white, // Light text

  card: PORSCHE_COLORS.grey800,
  cardForeground: PORSCHE_COLORS.grey100,

  popover: PORSCHE_COLORS.grey800,
  popoverForeground: PORSCHE_COLORS.grey100,

  border: PORSCHE_COLORS.grey700,
  input: PORSCHE_COLORS.grey700,

  muted: PORSCHE_COLORS.grey500,
  mutedForeground: PORSCHE_COLORS.grey200,

  primary: PORSCHE_COLORS.red,
  primaryForeground: PORSCHE_COLORS.white,

  secondary: PORSCHE_COLORS.grey700,
  secondaryForeground: PORSCHE_COLORS.grey100,

  accent: PORSCHE_COLORS.gold,
  accentForeground: PORSCHE_COLORS.black,

  destructive: PORSCHE_COLORS.redBright,
  destructiveForeground: PORSCHE_COLORS.white,

  ring: PORSCHE_COLORS.red, // Focus rings use red
} as const;

/**
 * Generate CSS variable declarations for light mode
 * Usage: Call this in :root selector in globals.css
 */
export function getLightModeVars(): Record<string, string> {
  return {
    "--background": LIGHT_MODE_TOKENS.background,
    "--foreground": LIGHT_MODE_TOKENS.foreground,
    "--card": LIGHT_MODE_TOKENS.card,
    "--card-foreground": LIGHT_MODE_TOKENS.cardForeground,
    "--popover": LIGHT_MODE_TOKENS.popover,
    "--popover-foreground": LIGHT_MODE_TOKENS.popoverForeground,
    "--border": LIGHT_MODE_TOKENS.border,
    "--input": LIGHT_MODE_TOKENS.input,
    "--muted": LIGHT_MODE_TOKENS.muted,
    "--muted-foreground": LIGHT_MODE_TOKENS.mutedForeground,
    "--primary": LIGHT_MODE_TOKENS.primary,
    "--primary-foreground": LIGHT_MODE_TOKENS.primaryForeground,
    "--secondary": LIGHT_MODE_TOKENS.secondary,
    "--secondary-foreground": LIGHT_MODE_TOKENS.secondaryForeground,
    "--accent": LIGHT_MODE_TOKENS.accent,
    "--accent-foreground": LIGHT_MODE_TOKENS.accentForeground,
    "--destructive": LIGHT_MODE_TOKENS.destructive,
    "--destructive-foreground": LIGHT_MODE_TOKENS.destructiveForeground,
    "--ring": LIGHT_MODE_TOKENS.ring,
  };
}

/**
 * Generate CSS variable declarations for dark mode
 * Usage: Call this in .dark selector in globals.css
 */
export function getDarkModeVars(): Record<string, string> {
  return {
    "--background": DARK_MODE_TOKENS.background,
    "--foreground": DARK_MODE_TOKENS.foreground,
    "--card": DARK_MODE_TOKENS.card,
    "--card-foreground": DARK_MODE_TOKENS.cardForeground,
    "--popover": DARK_MODE_TOKENS.popover,
    "--popover-foreground": DARK_MODE_TOKENS.popoverForeground,
    "--border": DARK_MODE_TOKENS.border,
    "--input": DARK_MODE_TOKENS.input,
    "--muted": DARK_MODE_TOKENS.muted,
    "--muted-foreground": DARK_MODE_TOKENS.mutedForeground,
    "--primary": DARK_MODE_TOKENS.primary,
    "--primary-foreground": DARK_MODE_TOKENS.primaryForeground,
    "--secondary": DARK_MODE_TOKENS.secondary,
    "--secondary-foreground": DARK_MODE_TOKENS.secondaryForeground,
    "--accent": DARK_MODE_TOKENS.accent,
    "--accent-foreground": DARK_MODE_TOKENS.accentForeground,
    "--destructive": DARK_MODE_TOKENS.destructive,
    "--destructive-foreground": DARK_MODE_TOKENS.destructiveForeground,
    "--ring": DARK_MODE_TOKENS.ring,
  };
}
