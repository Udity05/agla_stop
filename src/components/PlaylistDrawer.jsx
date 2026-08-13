import { useEffect, useState } from "react";


export default function PlaylistDrawer({
  playlistId,
  scene,
  onClose,
}) {
  const [tracks, setTracks] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadPlaylist() {
      try {
        const response = await fetch(
          `/api/youtube?playlistId=${encodeURIComponent(
            playlistId
          )}`
        );


        const data = await response.json();

        setTracks(data.tracks || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }


    loadPlaylist();
  }, [playlistId]);


  return (
    <div
      className="playlist-overlay"
      onClick={onClose}
    >

      <aside
        className="playlist-drawer"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>


        <div className="drawer-label">
          CURRENT ROUTE
        </div>


        <h2>
          {scene.title}
        </h2>


        <p>
          The songs playing on this part
          of the journey.
        </p>


        {loading ? (
          <div className="drawer-loading">
            LOADING PLAYLIST...
          </div>
        ) : (
          <div className="drawer-tracks">

            {tracks.map((track, index) => (

              <a
                key={track.id}
                href={track.url}
                target="_blank"
                rel="noreferrer"
                className="drawer-track"
              >

                <span className="track-number">
                  {String(index + 1).padStart(2, "0")}
                </span>


                <span className="drawer-track-info">

                  <strong>
                    {track.title}
                  </strong>

                  <small>
                    {track.artist}
                  </small>

                </span>


                <span>
                  ↗
                </span>

              </a>

            ))}

          </div>
        )}

      </aside>

    </div>
  );
}