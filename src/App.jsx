import { useEffect, useState } from "react";

import "./App.css";

import { scenes, getCurrentSceneKey } from "./data/scenes";

import Background from "./components/Background";

import Clock from "./components/Clock";

import OnlineCounter from "./components/OnlineCounter";

import MusicPlayer from "./components/MusicPlayer";

import PlaylistDrawer from "./components/PlaylistDrawer";


export default function App() {

  const [sceneKey, setSceneKey] = useState(
    getCurrentSceneKey(new Date().getHours())
  );


  const [previousScene, setPreviousScene] =
    useState(null);


  const [drawerOpen, setDrawerOpen] =
    useState(false);


  useEffect(() => {

    const timer = setInterval(() => {

      const newKey =
        getCurrentSceneKey(
          new Date().getHours()
        );


      setSceneKey((oldKey) => {

        if (oldKey !== newKey) {

          setPreviousScene(
            scenes[oldKey]
          );


          setTimeout(() => {
            setPreviousScene(null);
          }, 1600);

        }


        return newKey;

      });

    }, 1000);


    return () => {
      clearInterval(timer);
    };

  }, []);


  const scene = scenes[sceneKey];


  return (
    <main className="app">

      <Background
        scene={scene}
        previousScene={previousScene}
      />



      <header className="top-left">

        <div className="brand">

          <div className="brand-hindi">
            सफ़र
          </div>

          <div className="brand-english">
            SAFAR
          </div>

        </div>

      </header>


      

      <div className="top-right">

        <Clock />

        <OnlineCounter />

      </div>


      

      <section className="hero">
        
        <h1>
          {scene.title}
        </h1>


        <div className="hero-english">
          {scene.englishTitle}
        </div>


        <div className="hero-subtitle">
          {scene.subtitle}
        </div>

      </section>


  


      

      <MusicPlayer
        playlistId={scene.playlistId}
        spotifyUrl={scene.spotify}
        youtubeUrl={scene.youtube}
      />


     

      <button
        className="playlist-button"
        onClick={() => setDrawerOpen(true)}
      >
        ♫ PLAYLIST
      </button>


      

      <div className="scene-time">
        {scene.time}
      </div>





      {drawerOpen && (

        <PlaylistDrawer
          playlistId={scene.playlistId}
          scene={scene}
          onClose={() => setDrawerOpen(false)}
        />

      )}

    </main>
  );
}