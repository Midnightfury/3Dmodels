async function activateAR() {
  //scene and 3D model set-up
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl", { xrCompatibile: true });

  const scene = new THREE.Scene();
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
  directionalLight.position.set(10, 15, 10);
  directionalLight.castShadow = true;

  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canavs: canvas,
    context: gl,
  });

  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;
  scene.add(camera);
  
  const cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);

  //XR seesion set-up
  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["hit-test"],
  });
  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });

  const referenceSpace = await session.requestRefereceSpace("local");
  const viewerSpace = await session.requestRefereceSpace("viewer");
  const hitTestsource = await session.requestHitTestSource({
    space: viewerSpace,
  });

  const loader = new THREE.GLTFLoader();
  let reticle;
  loader.load(
    "https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf",
    function (gltf) {
      reticle = gltf.scene;
      reticle.visible = false;
      scene.add(reticle);
    }
  );

  let flower;
  loader.load(
    "https://immersive-web.github.io/webxr-samples/media/gltf/sunflower/sunflower.gltf",
    function (gltf) {
      flower = gltf.scene;
      flower.receiveShadow = true;
    }
  );

  session.addEventListener("select", (event) => {
    if (flower) {
      const flowerClone = flower.clone();
      flowerClone.position.copy(reticle.position);
      scene.add(flowerClone);
    }
  });

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

      const hitTestResults = frame.getHitTestResults(hitTestsource);
      if (hitTestResults.length > 0 && reticle) {
        const hitPose = hitTestResults[0].getPose(referenceSpace);
        reticle.visible = true;
        reticle.position.set(
          hitPose.transform.position.x,
          hitPose.transform.position.y,
          hitPose.transform.position.z
        );
        reticle.updateMatrixWorld(true);
      }

      renderer.render(scene, camera);
    }
  };
  session.requestAnimationFrame(onXRFrame);
}
