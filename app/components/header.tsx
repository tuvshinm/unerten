import { useState, useEffect } from "react";
export const Header = () => {
  const [language, setLanguage] = useState(true);
  // true is english
  // false is mongolian.
  useEffect(() => {
    const language = JSON.parse(localStorage.getItem("language") || "{}");
    setLanguage(language);
  }, []);
  function setLang() {
    localStorage.setItem("language", JSON.stringify(!language));
    setLanguage(!language);
  }
  useEffect(() => {
    console.log(language);
  }, [language]);
  return (
    <div className="h-10 flex justify-between items-center flex-row px-52 py-16 border-b-[1px] border-black">
      <div className="w-1/2 flex flex-row justify-evenly">
        <div onClick={setLang} className="cursor-pointer select-none">
          {language ? "english" : "монгол"}
        </div>
        <div>{language ? "fragrances" : "үнэртэй ус"}</div>
        <div>{language ? "misc" : "бусад"}</div>
      </div>
      <a className="cinzel-600 text-6xl" href="/shop">
        Unerten
      </a>
      <div className="flex flex-row justify-evenly w-1/2">
        <div>{language ? "about" : "бидний тухай"}</div>
        <div>{language ? "help" : "тусламж"}</div>
        <div>{language ? "cart" : "сагс"}</div>
      </div>
    </div>
  );
};
