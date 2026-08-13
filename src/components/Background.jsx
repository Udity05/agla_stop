export default function Background({
  scene,
  previousScene,
}) {
  return (
    <div className="scene-container">

      {previousScene && (
        <img
          className="scene-image scene-old"
          src={previousScene.image}
          alt=""
        />
      )}


      <img
        className="scene-image scene-current"
        src={scene.image}
        alt=""
      />


      <div className="scene-overlay" />

      <div className="grain" />

    </div>
  );
}