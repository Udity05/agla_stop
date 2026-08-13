import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";


export default function MusicPlayer({
  playlistId,
  spotifyUrl,
  youtubeUrl,
}) {

  const playerRef = useRef(null);

  const [tracks, setTracks] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [playing, setPlaying] = useState(false);

  const [muted, setMuted] = useState(true);

  const [progress, setProgress] = useState(0);


  /* =====================================================
     FETCH PLAYLIST
     ===================================================== */

  useEffect(() => {

    if (!playlistId) {
      setError("Playlist ID is missing.");
      setLoading(false);
      return;
    }


    async function loadPlaylist() {

      try {

        setLoading(true);

        setError("");


        const response = await fetch(
          `/api/youtube?playlistId=${encodeURIComponent(
            playlistId
          )}`
        );


        const data = await response.json();


        if (!response.ok) {
          throw new Error(
            data.error ||
            "Unable to load playlist."
          );
        }


        if (!data.tracks?.length) {
          throw new Error(
            "This playlist has no playable songs."
          );
        }


        setTracks(data.tracks);

        setCurrentIndex(0);

      } catch (err) {

        console.error(err);

        setError(err.message);

      } finally {

        setLoading(false);

      }

    }


    loadPlaylist();

  }, [playlistId]);


  /* =====================================================
     CURRENT SONG
     ===================================================== */

  const track =
    tracks.length > 0
      ? tracks[currentIndex]
      : null;


  /* =====================================================
     YOUTUBE PLAYER OPTIONS
     ===================================================== */

  const youtubeOptions = {

    height: "1",

    width: "1",

    playerVars: {

      autoplay: 1,

      controls: 0,

      disablekb: 1,

      fs: 0,

      modestbranding: 1,

      playsinline: 1,

      rel: 0,

    },

  };


  /* =====================================================
     PLAYER READY
     ===================================================== */

  function handlePlayerReady(event) {

    playerRef.current = event.target;

    event.target.mute();

    setMuted(true);

    event.target.playVideo();

  }


  /* =====================================================
     PLAYER STATE
     ===================================================== */

  function handlePlayerStateChange(event) {

    const YT = window.YT;

    if (!YT) return;


    if (
      event.data ===
      YT.PlayerState.PLAYING
    ) {

      setPlaying(true);

    }


    if (
      event.data ===
      YT.PlayerState.PAUSED
    ) {

      setPlaying(false);

    }


    if (
      event.data ===
      YT.PlayerState.ENDED
    ) {

      nextTrack();

    }

  }


  /* =====================================================
     PLAY / PAUSE
     ===================================================== */

  function togglePlay() {

    if (!playerRef.current) return;


    if (playing) {

      playerRef.current.pauseVideo();

    } else {

      playerRef.current.playVideo();

    }

  }


  /* =====================================================
     ENABLE SOUND
     ===================================================== */

  function enableSound() {

    if (!playerRef.current) return;


    playerRef.current.unMute();

    playerRef.current.setVolume(100);

    playerRef.current.playVideo();

    setMuted(false);

    setPlaying(true);

  }


  /* =====================================================
     NEXT
     ===================================================== */

  function nextTrack() {

    if (!tracks.length) return;


    setCurrentIndex(
      (current) =>
        (current + 1) %
        tracks.length
    );

  }


  /* =====================================================
     PREVIOUS
     ===================================================== */

  function previousTrack() {

    if (!tracks.length) return;


    setCurrentIndex(
      (current) =>
        (
          current -
          1 +
          tracks.length
        ) %
        tracks.length
    );

  }


  /* =====================================================
     LOAD NEW SONG
     ===================================================== */

  useEffect(() => {

    if (
      !playerRef.current ||
      !track
    ) {
      return;
    }


    playerRef.current.loadVideoById(
      track.id
    );

    playerRef.current.mute();

    setMuted(true);

  }, [currentIndex, track]);


  /* =====================================================
     PROGRESS BAR
     ===================================================== */

  useEffect(() => {

    const interval =
      setInterval(() => {

        if (
          !playerRef.current ||
          !playing
        ) {
          return;
        }


        const duration =
          playerRef.current
            .getDuration();


        const current =
          playerRef.current
            .getCurrentTime();


        if (duration > 0) {

          setProgress(
            (current / duration) * 100
          );

        }

      }, 500);


    return () => {
      clearInterval(interval);
    };

  }, [playing]);


  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {

    return (
      <section className="music-player">

        <div className="player-top">
          BUS RADIO
        </div>

        <div className="player-loading">
          TUNING INTO THE ROUTE...
        </div>

      </section>
    );

  }


  /* =====================================================
     ERROR
     ===================================================== */

  if (error) {

    return (
      <section className="music-player">

        <div className="player-top">
          BUS RADIO
        </div>

        <div className="player-error">
          {error}
        </div>

      </section>
    );

  }


  if (!track) {
    return null;
  }


  /* =====================================================
     UI
     ===================================================== */

  return (
    <>

      {/* INVISIBLE YOUTUBE PLAYER */}

      <div className="youtube-hidden">

        <YouTube
          videoId={track.id}
          opts={youtubeOptions}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
        />

      </div>


      {/* CUSTOM PLAYER */}

      <section
        className="music-player"
        onClick={enableSound}
      >

        {/* TOP */}

        <div className="player-top">

          <span>
            BUS RADIO
          </span>

          <span>
            {String(currentIndex + 1).padStart(2, "0")}
            {" / "}
            {String(tracks.length).padStart(2, "0")}
          </span>

        </div>


        {/* MAIN */}

        <div className="player-main">

          {/* ALBUM ART */}

          <div className="album-art">

            <img
              src={track.thumbnail}
              alt=""
            />

          </div>


          {/* INFORMATION */}

          <div className="track-information">

            <div className="now-playing">
              NOW PLAYING
            </div>


            <h2>
              {track.title}
            </h2>


            <p>
              {track.artist}
            </p>


            {/* PROGRESS */}

            <div className="progress-area">

              <div className="progress-background">

                <div
                  className="progress-value"
                  style={{
                    width:
                      `${progress}%`,
                  }}
                />

              </div>


              <div className="progress-time">

                <span>
                  {playing
                    ? "PLAYING"
                    : "PAUSED"}
                </span>

                <span>
                  {muted
                    ? "TAP FOR SOUND"
                    : "● LIVE"}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* CONTROLS */}

        <div className="player-controls">

          <button
            onClick={(event) => {
              event.stopPropagation();
              previousTrack();
            }}
          >
            |◀
          </button>


          <button
            className="main-play"
            onClick={(event) => {
              event.stopPropagation();
              togglePlay();
            }}
          >

            {playing
              ? "Ⅱ"
              : "▶"}

          </button>


          <button
            onClick={(event) => {
              event.stopPropagation();
              nextTrack();
            }}
          >
            ▶|
          </button>

        </div>


        {/* LINKS */}

        <div className="player-links">

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            YOUTUBE MUSIC ↗
          </a>

        </div>


      </section>

    </>
  );
}