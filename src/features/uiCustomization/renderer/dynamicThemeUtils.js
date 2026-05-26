export function createThemeStyle(theme) {
  const palette = getAccentPalette(theme?.primary_color || "green");

  return {
    "--color-primary": palette.primary,
    "--color-primary-soft": palette.primarySoft,
    "--color-secondary": palette.secondary,
    "--color-primary-rgb": palette.primaryRgb,

    "--color-border": `rgba(${palette.primaryRgb}, 0.18)`,
    "--color-border-strong": `rgba(${palette.primaryRgb}, 0.38)`,

    "--glow-primary": `0 0 14px rgba(${palette.primaryRgb}, 0.35)`,
    "--glow-soft": `0 0 24px rgba(${palette.primaryRgb}, 0.12)`,
  };
}

function getAccentPalette(primaryColor) {
  const palettes = {
    green: {
      primary: "#41ff94",
      primarySoft: "#1edc72",
      secondary: "#83ffbd",
      primaryRgb: "65, 255, 148",
    },
    blue: {
      primary: "#60a5fa",
      primarySoft: "#3b82f6",
      secondary: "#93c5fd",
      primaryRgb: "96, 165, 250",
    },
    purple: {
      primary: "#c084fc",
      primarySoft: "#a855f7",
      secondary: "#d8b4fe",
      primaryRgb: "192, 132, 252",
    },
    slate: {
      primary: "#cbd5e1",
      primarySoft: "#94a3b8",
      secondary: "#e2e8f0",
      primaryRgb: "203, 213, 225",
    },
  };

  return palettes[primaryColor] || palettes.green;
}