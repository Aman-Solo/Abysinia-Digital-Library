import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
  const [current, setCurrent] = useState("en");

  useEffect(() => {
    const sync = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo && combo.value && combo.value !== current) {
        setCurrent(combo.value);
      }
    };
    const interval = setInterval(sync, 1000);
    return () => clearInterval(interval);
  }, [current]);

  const changeLanguage = (lang) => {
    setCurrent(lang);

    const trigger = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = lang;
        const events = ["focus", "change", "click", "blur"];
        events.forEach(evt => combo.dispatchEvent(new Event(evt, { bubbles: true })));
      }
    };

    // LAWD HAVE MERCY
    trigger();

    setTimeout(trigger, 50);

    setTimeout(trigger, 150);
  };

  const getBtnClass = (lang) => {
    const base = "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 transform active:scale-95 text-xl ";
    const active = "bg-amber-600 text-white shadow-lg shadow-amber-600/40 scale-110 z-10 ring-2 ring-amber-500/50";
    const inactive = "bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 opacity-60 hover:opacity-100 hover:scale-105";
    return base + (current === lang ? active : inactive);
  };

  return (
    <div className="flex gap-4 items-center p-1.5 bg-slate-100/30 dark:bg-white/5 rounded-2xl border border-white/10 shadow-sm backdrop-blur-md">
      <button onClick={() => changeLanguage("en")} className={getBtnClass("en")} title="English">🇺🇸</button>
      <button onClick={() => changeLanguage("am")} className={getBtnClass("am")} title="Amharic">🇪🇹</button>
      <button onClick={() => changeLanguage("fr")} className={getBtnClass("fr")} title="French">🇫🇷</button>
    </div>
  );
};

export default LanguageSwitcher;
