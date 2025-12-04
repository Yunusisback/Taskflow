import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });


  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen w-full bg-stone-50 dark:bg-neutral-950 text-stone-800 dark:text-neutral-100 overflow-x-hidden font-sans transition-colors duration-300">
        <KanbanBoard darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
      </div>
    </div>
  );
}

export default App;