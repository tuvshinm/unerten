import { useState, useEffect } from "react";
export const Header = () => {
  const [language, setLanguage] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(false);
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
    document
      .getElementById("dropdownmenu")
      ?.classList.toggle("-translate-y-10");
    document.getElementById("dropdownmenu")?.classList.toggle("hidden");
  }, [brandsOpen]);
  return (
    <div className="flex flex-col">
      <div className="h-10 flex justify-between items-center flex-row px-52 pt-16 pb-8 gap-2">
        <div className="w-1/2 flex flex-row justify-evenly">
          <div onClick={setLang} className="cursor-pointer select-none">
            {language ? "english" : "монгол"}
          </div>
          <div>{language ? "fragrances" : "үнэртэй ус"}</div>
          <div
            onClick={() => {
              setBrandsOpen(!brandsOpen);
            }}
            className="cursor-pointer"
          >
            {language ? "brands" : "брэндүүд"}
          </div>
        </div>
        <a className="cinzel-600 text-6xl" href="/shop">
          Unerten
        </a>
        <div className="flex flex-row justify-evenly w-1/2">
          <div>{language ? "about" : "бидний тухай"}</div>
          <div>{language ? "help" : "тусламж"}</div>
          <div>{language ? "contact" : "холбоо барих"}</div>
        </div>
      </div>
      <div className="h-10 flex justify-center items-center border-b-[1px]  border-black">
        <input
          type="text"
          className="border-[1px] border-black w-2/3 placeholder:text-center"
          placeholder="search for perfume"
        />
      </div>
      <div
        className="transition-all duration-100 hidden -translate-y-10 -z-10"
        id="dropdownmenu"
      >
        Fart
      </div>
    </div>
  );
};
