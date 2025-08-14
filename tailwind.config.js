// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
        },
      },
      animation: {
        "slow-pulse": "pulseScale 2s ease-in-out infinite",
      },
    },
  },
};
