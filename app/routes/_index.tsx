import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
export const meta: MetaFunction = () => {
  return [
    { title: "Unerten" },
    { name: "description", content: "Welcome to Unerten!" },
  ];
};

export default function Index() {
  const [playing, setPlaying] = useState(false);
  function play() {
    const audio = document.getElementById(
      "skeleton"
    ) as HTMLAudioElement | null;
    setPlaying(true);
    audio?.play();
  }
  function pause() {
    const audio = document.getElementById(
      "skeleton"
    ) as HTMLAudioElement | null;
    setPlaying(false);
    audio?.pause();
  }
  return (
    <>
      <main>
        <div className="bg-[url('/spinning-skull.gif')] bg-repeat-round bg-black w-screen h-screen flex flex-col justify-center items-center text-white">
          <h1
            onClick={playing ? pause : play}
            className="absolute top-2 cursor-pointer"
          >
            {playing ? "pause" : "play"}
          </h1>
          <a href="./shop/">
            <div className="flex flex-col justify-center items-center">
              <div className="tracking-wide text-5xl font-light border-b-2 pb-4 px-8 cinzel-600">
                Unerten
              </div>
              <h1 className="tracking-widest textl-2xl pt-2">enter</h1>
            </div>
          </a>
        </div>
        <audio id="skeleton" className="hidden" src="skeleton.mp3"></audio>
      </main>
    </>
  );
}
