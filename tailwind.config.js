/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ffdd95",
                secondary: "#2a2c31",
                accent: "#cae962",
                dark: "#1a1c21",
                "dark-light": "#2a2c31",
            },
            backgroundImage: {
                "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
            }
        },
    },
    plugins: [],
}
