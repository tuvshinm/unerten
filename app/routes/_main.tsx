import { Outlet } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { Brand } from "~/utils/types.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { AtoZBrands } from "~/utils/mongoUtils.server"; // Keep this in the server context
export const meta: MetaFunction = () => {
  const [fart, setTitle] = useState(" Unerten Shop at");
  function cycleTitle() {
    var tit = fart.split("");
    var lastchar = tit.pop();
    tit.unshift(lastchar!);
    setTitle(tit.join(""));
  }
  setInterval(cycleTitle, 300);
  return [
    { title: fart },
    { name: "description", content: "Welcome to Unerten!" },
  ];
};
export async function loader({}: LoaderFunctionArgs) {
  const data = await AtoZBrands(); // Ensure this fetch works
  if (!data) {
    throw new Response("No data found", { status: 404 });
  }
  return data;
}
interface LoaderData {
  aToc: Brand[];
  dToj: Brand[];
  kTon: Brand[];
  oTor: Brand[];
  sToz: Brand[];
  extra: Brand[];
}
const Header = () => {
  const loaderData = useLoaderData<LoaderData | null>(); // Allow for null

  if (!loaderData) {
    return <div>Loading...</div>; // Or handle the null case gracefully
  }

  const { aToc, dToj, kTon, oTor, sToz, extra } = loaderData;

  const [language, setLanguage] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [tier2Open, setTier2Open] = useState(false);
  const [tier2Name, setTier2Name] = useState("");
  const [previous, setPrevious] = useState("");

  useEffect(() => {
    const language = JSON.parse(localStorage.getItem("language") || "{}");
    setLanguage(language);
  }, []);
  function setLang() {
    localStorage.setItem("language", JSON.stringify(!language));
    setLanguage(!language);
  }
  function setTier2(id: any) {
    if (tier2Name === id) {
      setTier2Open(!tier2Open);
    } else {
      setTier2Name(id);
      setTier2Open(true);
    }
    let plus = document.getElementById(id.charAt(0) + "+");
    let prev = document.getElementById(previous.charAt(0) + "+");
    if (prev?.innerText === "-" && plus?.innerText === "+") {
      prev.innerText = "+";
      plus.innerText = "-";
    } else if (prev?.innerText === "+" && plus?.innerText === "+") {
      plus.innerText = "-";
    } else if (prev?.innerText === "+" && plus?.innerText === "-") {
      plus.innerText = "+";
    } else if (prev?.innerText === "-" && plus?.innerText === "-") {
      prev.innerText = "+";
      plus.innerText = "+";
    } else {
      plus!.innerText = "-";
    }

    setPrevious(id);
  }
  function tier2Type() {
    if (tier2Name === "aToc") {
      return aToc;
    } else if (tier2Name === "dToj") {
      return dToj;
    } else if (tier2Name === "kTon") {
      return kTon;
    } else if (tier2Name === "oTor") {
      return oTor;
    } else if (tier2Name === "sToz") {
      return sToz;
    } else if (tier2Name === "extra") {
      return extra;
    } else {
      return [];
    }
  }
  return (
    <div className="inline-flex flex-col">
      <div className="h-10 flex justify-between items-center flex-row px-52 pt-16 pb-8 gap-2 bg-white">
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
      <div className="h-10 flex justify-center items-center border-b-[1px]  border-black bg-white">
        <input
          type="text"
          className="border-[1px] border-black w-2/3 placeholder:text-center"
          placeholder="search for perfume"
        />
      </div>
      <div
        className={`transition-all duration-300 ${
          brandsOpen ? "h-16" : "h-0"
        } overflow-hidden  w-screen flex flex-row justify-around items-center  ${
          brandsOpen ? "border-b-[1px]" : "border-b-0"
        } border-black`}
        id="dropdownmenu"
      >
        <h1>ALL</h1>
        <div className="flex flex-row">
          <h1
            id="aToc"
            onClick={(event) => {
              const target = event.target as HTMLHeadingElement;
              setTier2(target.id);
            }}
          >
            A-C&nbsp;
          </h1>
          <h1 id="a+"> +</h1>
        </div>
        <div className="flex flex-row">
          <h1
            id="dToj"
            onClick={(event) => {
              const target = event.target as HTMLHeadingElement;
              setTier2(target.id);
            }}
          >
            D-J&nbsp;
          </h1>
          <h1 id="d+"> +</h1>
        </div>

        <div className="flex flex-row">
          <h1
            id="kTon"
            onClick={(event) => {
              const target = event.target as HTMLHeadingElement;
              setTier2(target.id);
            }}
          >
            K-N&nbsp;
          </h1>
          <h1 id="k+"> +</h1>
        </div>

        <div className="flex flex-row">
          <h1
            id="oTor"
            onClick={(event) => {
              const target = event.target as HTMLHeadingElement;
              setTier2(target.id);
            }}
          >
            O-R
          </h1>
          <h1 id="o+"> +</h1>
        </div>
        <div className="flex flex-row">
          <h1
            id="sToz"
            onClick={(event) => {
              const target = event.target as HTMLHeadingElement;
              setTier2(target.id);
            }}
          >
            S-Z&nbsp;
          </h1>
          <h1 id="s+"> +</h1>
        </div>
        <div className="flex flex-row">
          <h1
            id="extra"
            onClick={(event) => {
              const target = event.target as HTMLHeadingElement;
              setTier2(target.id);
            }}
          >
            #&nbsp;
          </h1>
          <h1 id="#+">+</h1>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${
          tier2Open ? "h-32" : "h-0"
        } overflow-hidden  w-screen flex flex-row justify-around items-center  ${
          tier2Open ? "border-b-[1px]" : "border-b-0"
        } border-black `}
        id="dropdownmenu"
      >
        {tier2Type().map((v) => {
          return <h1 key={v._id}>{v.name}</h1>;
        })}
      </div>
    </div>
  );
};

export default function ShopLayout() {
  return (
    <>
      <main className="h-screen w-screen">
        <Header />
        <Outlet />
      </main>
    </>
  );
}
