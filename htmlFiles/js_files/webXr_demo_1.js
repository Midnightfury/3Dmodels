async function activateAR() {
  //scene and 3D model set-up
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl", { xrCompatibile: true });

  const scene = new THREE.Scene();
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  ];

  const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
    materials
  );
  cube.position.set(1, 1, 1);
  scene.add(cube);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canavs: canvas,
    context: gl,
  });

  renderer.autoClear = false;

  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;

  //XR seesion set-up
  const session = await navigator.xr.requestSession("immersive-ar");
  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });

  const referenceSpace = await session.requestRefereceSpace("local");

  const onXRFrame = (time, frame) => {
    session.requestAnimationFrame(onXRFrame);
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      session.renderState.baseLayer.framebuffer
    );

    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
      const view = pose.views[0];
      const viewport = session.renderState.baseLayer.getViewport(view);
      renderer.setsize(viewport.width, viewport.height);

      camera.matrix.fromArray(view.transform.matrix);
      camera.projectionMatrix.fromArray(viewport.projectionMatrix);
      camera.updateMatrixWorld(true);

      renderer.render(scene, camera);
    }
  };
  session.requestAnimationFrame(onXRFrame);
}
