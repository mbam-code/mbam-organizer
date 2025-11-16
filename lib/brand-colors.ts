/**
 * MBAM Brand Design System Colors
 *
 * A unified color palette inspired by motorsport heritage.
 * These values are the single source of truth for the entire application.
 *
 * Usage:
 * - In CSS: Use CSS variables defined in globals.css (--primary, --background, etc.)
 * - In JavaScript: Import from this file for color constants
 * - In Tailwind: Extended theme uses CSS variables
 */

/**
 * MBAM Brand Primitives
 * Core color palette that defines the visual identity
 */
export const MBAM_BRAND_COLORS = {
  // Neutrals
  black: "#000000",
  white: "#FFFFFF",

  // MBAM Primary Red
  red: "#B12B28", // Bold motorsport red
  redBright: "#D5001C", // Bright red for alerts/destructive

  // MBAM Accent Colors
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
 * These map MBAM brand colors to semantic roles for light backgrounds
 */
export const LIGHT_MODE_TOKENS = {
  background: MBAM_BRAND_COLORS.grey100, // Page/section backgrounds
  foreground: MBAM_BRAND_COLORS.black, // Primary text

  card: MBAM_BRAND_COLORS.white,
  cardForeground: MBAM_BRAND_COLORS.grey800,

  popover: MBAM_BRAND_COLORS.white,
  popoverForeground: MBAM_BRAND_COLORS.grey800,

  border: MBAM_BRAND_COLORS.grey200,
  input: MBAM_BRAND_COLORS.grey100,

  muted: MBAM_BRAND_COLORS.grey500,
  mutedForeground: MBAM_BRAND_COLORS.grey100,

  primary: MBAM_BRAND_COLORS.red,
  primaryForeground: MBAM_BRAND_COLORS.white,

  secondary: MBAM_BRAND_COLORS.grey500,
  secondaryForeground: MBAM_BRAND_COLORS.white,

  accent: MBAM_BRAND_COLORS.yellow,
  accentForeground: MBAM_BRAND_COLORS.black,

  destructive: MBAM_BRAND_COLORS.redBright,
  destructiveForeground: MBAM_BRAND_COLORS.white,

  ring: MBAM_BRAND_COLORS.red,
} as const;

/**
 * Dark Mode Semantic Tokens
 * These map MBAM brand colors to semantic roles for dark backgrounds
 */
export const DARK_MODE_TOKENS = {
  background: MBAM_BRAND_COLORS.grey900, // Deep dark background
  foreground: MBAM_BRAND_COLORS.white, // Light text

  card: MBAM_BRAND_COLORS.grey800,
  cardForeground: MBAM_BRAND_COLORS.grey100,

  popover: MBAM_BRAND_COLORS.grey800,
  popoverForeground: MBAM_BRAND_COLORS.grey100,

  border: MBAM_BRAND_COLORS.grey700,
  input: MBAM_BRAND_COLORS.grey700,

  muted: MBAM_BRAND_COLORS.grey500,
  mutedForeground: MBAM_BRAND_COLORS.grey200,

  primary: MBAM_BRAND_COLORS.red,
  primaryForeground: MBAM_BRAND_COLORS.white,

  secondary: MBAM_BRAND_COLORS.grey700,
  secondaryForeground: MBAM_BRAND_COLORS.grey100,

  accent: MBAM_BRAND_COLORS.gold,
  accentForeground: MBAM_BRAND_COLORS.black,

  destructive: MBAM_BRAND_COLORS.redBright,
  destructiveForeground: MBAM_BRAND_COLORS.white,

  ring: MBAM_BRAND_COLORS.red,
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
