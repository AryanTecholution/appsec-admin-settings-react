module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // match everything under src/
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        Poppins: ["Poppins", "serif"],
        Roboto: ["Roboto", "serif"],
      },
      fontWeight: {
        100: "100",
        300: "300",
        400: "400",
        500: "500",
        700: "700",
        900: "900",
      },
    },
  },
  plugins: [],
};
