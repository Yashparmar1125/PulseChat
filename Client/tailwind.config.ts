import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
      content: ["./src/**/*.{ts,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "pulse-cyan": "hsl(var(--pulse-cyan))",
        "pulse-black": "hsl(var(--pulse-black))",
        "pulse-white": "hsl(var(--pulse-white))",
        "pulse-grey-light": "hsl(var(--pulse-grey-light))",
        "pulse-grey-subtle": "hsl(var(--pulse-grey-subtle))",
        "pulse-grey-text": "hsl(var(--pulse-grey-text))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-ecg": {
          "0%": { transform: "translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "pulse-beat": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        "pulse-sent": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "message-slide": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.6" },
        },
        "brand-pulse": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "1",
            boxShadow: "0 0 20px rgba(0, 204, 255, 0.2)"
          },
          "50%": { 
            transform: "scale(1.05)",
            opacity: "0.9",
            boxShadow: "0 0 30px rgba(0, 204, 255, 0.4)"
          },
        },
        "ecg-line": {
          "0%": { 
            strokeDashoffset: "0",
            opacity: "0.3"
          },
          "50%": { 
            opacity: "0.6"
          },
          "100%": { 
            strokeDashoffset: "-100",
            opacity: "0.3"
          },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ecg": "pulse-ecg 2s ease-in-out infinite",
        "pulse-beat": "pulse-beat 1.5s ease-in-out infinite",
        "pulse-sent": "pulse-sent 0.3s ease-out",
        "message-slide": "message-slide 0.3s ease-out",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "brand-pulse": "brand-pulse 3s ease-in-out infinite",
        "ecg-line": "ecg-line 2s linear infinite",
        "float-gentle": "float-gentle 6s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
