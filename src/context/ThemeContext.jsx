import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

const PALETTES = {
    dark: {
        background: "#090315",
        card: "#160626",
        border: "#412A6F",
        text: "#FFFFFF",
        subtext: "#8B859B",
        accent: "#7F56D9",
    },
    light: {
        background: "#F5F3FA",
        card: "#FFFFFF",
        border: "#D8D0EC",
        text: "#1A132B",
        subtext: "#6E667D",
        accent: "#7F56D9",
    },
};

const SIZE_SCALE = [0.9, 1, 1.15];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");
    const [textSizeIndex, setTextSizeIndex] = useState(1);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setTheme(data.theme || "dark");
                setTextSizeIndex(data.textSizeIndex ?? 1);
            }
        } catch (error) {
            console.log("THEME LOAD ERROR:", error);
        }
    };

    const colors = PALETTES[theme];
    const scale = SIZE_SCALE[textSizeIndex] ?? 1;

    const fontSize = (base) => Math.round(base * scale);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, textSizeIndex, setTextSizeIndex, colors, fontSize }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}