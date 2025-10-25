/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: "#1877f2",
          lightblue: "#1775ee",
          green: "#42b72a",
        },
        gray: {
          bg: "#f0f2f5",
          light: "#e4e6eb",
          border: "#c0c0c0",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
        "card-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      spacing: {
        18: "4.5rem",
        50: "12.5rem",
      },
      height: {
        topbar: "50px",
        "screen-minus-topbar": "calc(100vh-50px)",
        "screen-minus-70": "calc(100vh-70px)",
      },
      maxWidth: {
        feed: "850px",
        "feed-profile": "1000px",
        rightbar: "350px",
        "rightbar-profile": "400px",
        sidebar: "320px",
        "auth-box": "450px",
      },
      zIndex: {
        topbar: "999",
        sidebar: "10000",
        modal: "100",
      },
    },
  },
  plugins: [],
};
