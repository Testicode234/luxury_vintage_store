/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* rgba(255, 255, 255, 0.1) */
        input: "var(--color-input)", /* #141414 */
        ring: "var(--color-ring)", /* #FFFFFF */
        background: "var(--color-background)", /* #0A0A0A */
        foreground: "var(--color-foreground)", /* #FFFFFF */
        primary: {
          DEFAULT: "var(--color-primary)", /* #000000 */
          foreground: "var(--color-primary-foreground)", /* #FFFFFF */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* #1A1A1A */
          foreground: "var(--color-secondary-foreground)", /* #FFFFFF */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* #EF4444 */
          foreground: "var(--color-destructive-foreground)", /* #FFFFFF */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* #1A1A1A */
          foreground: "var(--color-muted-foreground)", /* #B3B3B3 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* #FFFFFF */
          foreground: "var(--color-accent-foreground)", /* #000000 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* #1A1A1A */
          foreground: "var(--color-popover-foreground)", /* #FFFFFF */
        },
        card: {
          DEFAULT: "var(--color-card)", /* #141414 */
          foreground: "var(--color-card-foreground)", /* #FFFFFF */
        },
        success: {
          DEFAULT: "var(--color-success)", /* #22C55E */
          foreground: "var(--color-success-foreground)", /* #FFFFFF */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* #F59E0B */
          foreground: "var(--color-warning-foreground)", /* #000000 */
        },
        error: {
          DEFAULT: "var(--color-error)", /* #EF4444 */
          foreground: "var(--color-error-foreground)", /* #FFFFFF */
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
        "slide-in": "slide-in 0.15s ease-out",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(255, 255, 255, 0.1)',
        'pronounced': '0 8px 24px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}