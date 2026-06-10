// Theme & Preset Accent Color Palette Controller
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const accentMenuBtn = document.getElementById("accent-menu-btn");
    const accentPalette = document.getElementById("accent-palette");

    // 24 Hand-picked vibrant, beautiful developer-focused accent colors
    const vibrantColors = [
        // Row 1: Warm Spectrum (Reds to Yellows)
        "#ef4444", "#ff4500", "#f97316", "#ff8c00", "#f59e0b", "#eab308",
        // Row 2: Nature Spectrum (Limes to Teals)
        "#84cc16", "#32cd32", "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
        // Row 3: Cool Spectrum (Cyans to Violets)
        "#00f5ff", "#1e90ff", "#3b82f6", "#4f46e5", "#7b68ee", "#6366f1",
        // Row 4: Deep Spectrum (Purples to Pinks)
        "#8b5cf6", "#a855f7", "#9333ea", "#d946ef", "#ec4899", "#f43f5e"
    ];

    // Helper: Convert Hex color to RGBA string for CSS variable glow effects
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Apply color values down to custom CSS tokens
    function setAccentColor(color) {
        document.documentElement.style.setProperty("--accent-color", color);
        document.documentElement.style.setProperty("--accent-glow", hexToRgba(color, 0.12));

        // Synchronize active classes inside the palette grid
        document.querySelectorAll(".swatch-btn").forEach(btn => {
            if (btn.dataset.color === color) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        localStorage.setItem("clueless-accent", color);
    }

    // Generate the 24 color circles inside the menu programmatically
    vibrantColors.forEach(color => {
        const btn = document.createElement("button");
        btn.className = "swatch-btn";
        btn.style.backgroundColor = color;
        btn.dataset.color = color;
        btn.setAttribute("title", color);

        btn.addEventListener("click", () => {
            setAccentColor(color);
            accentPalette.classList.remove("show");
        });

        accentPalette.appendChild(btn);
    });

    // Handle dropdown open and close cycles
    accentMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        accentPalette.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        accentPalette.classList.remove("show");
    });

    // Theme logic transitions
    function toggleTheme() {
        document.documentElement.classList.add("theme-transitioning");

        const isLight = document.documentElement.classList.toggle("light-mode");
        localStorage.setItem("clueless-theme", isLight ? "light" : "dark");
        if (themeToggle) themeToggle.innerText = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";

        setTimeout(() => {
            document.documentElement.classList.remove("theme-transitioning");
        }, 300);
    }

    const savedTheme = localStorage.getItem("clueless-theme");
    const savedAccent = localStorage.getItem("clueless-accent") || "#22c55e";

    setAccentColor(savedAccent);

    if (savedTheme === "light") {
        document.documentElement.classList.add("light-mode");
        if (themeToggle) themeToggle.innerText = "🌙 Dark Mode";
    } else {
        if (themeToggle) themeToggle.innerText = "☀️ Light Mode";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
});