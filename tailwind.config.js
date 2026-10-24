/** @type {import('tailwindcss').Config} */

// Check if the build environment is specifically for the widget/plugin (useful for purging)
const isWidgetOnly = process.env.MODE === 'widget';

module.exports = {
  // -------------------------------------------------------------------------
  // Core Configuration
  // -------------------------------------------------------------------------
  corePlugins: {
    // Ensures basic styles are included. Crucial for widget integration when not using global reset.
    preflight: true,
  },
  
  // NOTE: 'mode: jit' is deprecated in Tailwind v3/v4 as JIT is the default. Removed for cleanup.
  
  darkMode: 'class',
  
  // Content sources for purging unused CSS
  content: [
    // Include all source files for compilation
    './src/**/*.{js,ts,jsx,tsx}',
    // Optionally include external packages if they provide JSX/TSX components
    // './node_modules/external-package/dist/**/*.js', 
  ],

  // -------------------------------------------------------------------------
  // Theming & Customization
  // -------------------------------------------------------------------------
  theme: {
    extend: {
      colors: {
        // Dynamic Theming (Recommended CSS Variable Usage)
        // Tailwind automatically strips the alpha value, making the usage cleaner 
        // in CSS like: bg-primary/50
        primary: 'var(--jupiter-plugin-primary-color, #C7F284)',
        background: 'var(--jupiter-plugin-background-color, #000000)',
        'primary-text': 'var(--jupiter-plugin-primary-text-color, #E8F9FF)',
        warning: 'var(--jupiter-plugin-warning-color, #FBFB24)',
        interactive: 'var(--jupiter-plugin-interactive-color, #212A36)',
        module: 'var(--jupiter-plugin-module-color, #10171F)',

        // Static/Hardcoded Colors (Legacy or specific UI elements)
        'v3-bg': '#1C2936',
        'utility-warning-300': '#B54708',
        'success': '#23C1AA',
        'uiv2-text': '#07090F',
        'landing-bg': '#0b0e13',
        'landing-gradient-start': '#0f111a',
        'landing-gradient-end': '#181b27',
        'landing-primary': '#C7F284',
      },
      
      fontSize: {
        // Custom font size utility for extra extra small text
        xxs: ['0.625rem', '1rem'], 
      },
      
      backgroundImage: {
        'v3-text-gradient': 'linear-gradient(247.44deg, #C7F284 13.88%, #00BEF0 99.28%)',
      },
      
      // Animations & Keyframes
      keyframes: {
        shine: {
          '100%': { 'background-position': '200% center' },
        },
        hue: {
          '0%, 100%': { filter: 'hue-rotate(0deg)' }, // Use filter instead of -webkit-filter
          '100%': { filter: 'hue-rotate(-360deg)' },
        },
        // Native 'pulse' keyframe is overridden; keeping the custom definition
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      animation: {
        shine: 'shine 3.5s linear infinite',
        hue: 'hue 10s infinite linear',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      boxShadow: {
        'swap-input-dark': '0px 2px 16px rgba(199, 242, 132, 0.25)',
      },
    },
  },
  
  // NOTE: 'variants' block is generally unnecessary in modern Tailwind as 
  // most utilities are responsive by default, including dark mode support.
  // Keeping it minimal unless specific variants are required.
  variants: {
    extend: {
      backgroundImage: ['dark', 'hover', 'focus-within', 'focus'],
    },
  },
};
