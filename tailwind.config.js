/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["assets/**", "entrypoints/**", "entrypoints/dashboard/**", "components/**"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [{
            light: { 
                "--rounded-btn": "20px",
                "primary": "#A259FF",
                "primary-content": "#ffffff",
                "secondary": "#A259FF",
                "secondary-content": "#ffffff",
                "tertiary": "#A259FF",
                "tertiary-content": "#ffffff",
                "accent": "#FF6250",
                "accent-content": "#ffffff",
                "base-100": "#303030",
                "base-200": "#484848",
                "base-300": "#858584",
                "base-content": "#D1D1D1",
                "neutral": "#3B3B3B",
                "neutral-content": "#CCCCCC",
                "success": "#377DF7",
                "success-content": "#fff",
                "error": "#FF7262",
                "error-content": "#ffffff",
                "warning": "#F6851B",
                "warning-content": "#ffffff",
            },

            dark: {
                "--rounded-btn": "20px",
                "primary": "#A259FF",
                "primary-content": "#ffffff",
                "secondary": "#A259FF",
                "secondary-content": "#ffffff",
                "tertiary": "#A259FF",
                "tertiary-content": "#ffffff",
                "accent": "#FF6250",
                "accent-content": "#fff",
                "base-100": "#303030",
                "base-200": "#484848",
                "base-300": "#858584",
                "base-content": "#D1D1D1",
                "neutral": "#3B3B3B",
                "neutral-content": "#CCCCCC",
                "success": "#377DF7",
                "success-content": "#fff",
                "error": "#FF7262",
                "error-content": "#ffffff",
                "warning": "#F6851B",
                "warning-content": "#ffffff",
            },
        }]
    },
};