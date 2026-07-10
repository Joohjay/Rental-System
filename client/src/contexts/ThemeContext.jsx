import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ACCENT_COLORS = {
  indigo: { hex: '#6366f1', label: 'Indigo', ring: 'ring-indigo-500', bg: 'bg-indigo-600', bgLight: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-500' },
  violet: { hex: '#8b5cf6', label: 'Violet', ring: 'ring-violet-500', bg: 'bg-violet-600', bgLight: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-500' },
  pink: { hex: '#ec4899', label: 'Pink', ring: 'ring-pink-500', bg: 'bg-pink-600', bgLight: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-500' },
  red: { hex: '#ef4444', label: 'Red', ring: 'ring-red-500', bg: 'bg-red-600', bgLight: 'bg-red-50', text: 'text-red-600', border: 'border-red-500' },
  amber: { hex: '#f59e0b', label: 'Amber', ring: 'ring-amber-500', bg: 'bg-amber-600', bgLight: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-500' },
  emerald: { hex: '#10b981', label: 'Emerald', ring: 'ring-emerald-500', bg: 'bg-emerald-600', bgLight: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-500' },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('accent') || 'indigo';
  });

  const [compact, setCompact] = useState(() => {
    return localStorage.getItem('compact') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const root = document.documentElement;
    const c = ACCENT_COLORS[accent];
    if (c) {
      root.style.setProperty('--accent-hex', c.hex);
      root.style.setProperty('--accent-ring', c.ring);
    }
    localStorage.setItem('accent', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem('compact', compact);
  }, [compact]);

  const toggleTheme = useCallback(() => setDark((d) => !d), []);
  const setThemeMode = useCallback((mode) => {
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
    } else {
      setDark(mode === 'dark');
    }
  }, []);

  const currentAccent = ACCENT_COLORS[accent] || ACCENT_COLORS.indigo;

  return (
    <ThemeContext.Provider value={{
      dark, toggleTheme, setThemeMode,
      accent, setAccent, currentAccent, accentColors: ACCENT_COLORS,
      compact, setCompact,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export { ACCENT_COLORS };
