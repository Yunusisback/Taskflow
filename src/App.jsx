import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import { Loader2 } from "lucide-react";

function App() {
  // Tema durumu  hata yönetimi ile
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (error) {
      console.error("Tema okuma hatası:", error);
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });

  // Yüklenme durumu
  const [isLoading, setIsLoading] = useState(true);

  // Tema kaydetme - hata yönetimi ile
  useEffect(() => {
    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch (error) {
      console.error("Tema kaydetme hatası:", error);
      // Kullanıcıya bildirim gösterilebilir
    }
  }, [darkMode]);

  // Sistem tema değişikliklerini dinle
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      try {
        const savedTheme = localStorage.getItem("theme");
        // Eğer kullanıcı manuel tema seçmemişse sistem temasını kullan
        if (!savedTheme) {
          setDarkMode(e.matches);
        }
      } catch (error) {
        setDarkMode(e.matches);
      }
    };

    // Modern tarayıcılar için addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Eski tarayıcılar için fallback
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Başlangıç yükleme simülasyonu (localStorage verilerini yükle)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Yükleme ekranı 
  if (isLoading) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen w-full bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Logo animasyonlu */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-2xl blur-2xl animate-pulse" />
              <div className="relative p-6 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200 dark:border-neutral-700">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-xl flex items-center justify-center animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2L7 4H3C2.4 4 2 4.4 2 5V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V5C22 4.4 21.6 4 21 4H17L15 2H9Z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Yükleme metni */}
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-neutral-100 tracking-tight">
                Taskflow
              </h2>
              <div className="flex items-center gap-2 text-stone-500 dark:text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Yükleniyor...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
  
      <div className="min-h-screen w-full bg-stone-50 dark:bg-neutral-950 text-stone-800 dark:text-neutral-100 overflow-x-hidden font-sans transition-colors duration-500 ease-in-out">
        <KanbanBoard darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
      </div>
    </div>
  );
}

export default App;