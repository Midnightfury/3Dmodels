import * as THREE from "https://cdn.skypack.dev/three@0.134.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/GLTFLoader.js";

const MAX_OBJECTS = 1;
let objects = [];

async function activateAR() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl", { xrCompatible: true });

  const scene = new THREE.Scene();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 2, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  planeGeometry.rotateX(-Math.PI / 2);

  const planeMaterial = new THREE.ShadowMaterial({
    color: 0x111111,
    opacity: 0.5,
  });

  const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  shadowPlane.receiveShadow = true;
  shadowPlane.position.y = 10000;
  scene.add(shadowPlane);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canvas: canvas,
    context: gl,
  });
  renderer.autoClear = false;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;

  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["hit-test", "dom-overlay"],
    domOverlay: { root: document.body },
  });
  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });

  const referenceSpace = await session.requestReferenceSpace("local");
  const viewerSpace = await session.requestReferenceSpace("viewer");
  const hitTestSource = await session.requestHitTestSource({
    space: viewerSpace,
  });

  const loader = new GLTFLoader();
  let reticle;
  loader.load(
    "https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf",
    function (gltf) {
      reticle = gltf.scene;
      reticle.scale.set(0.4, 0.4, 0.4);
      reticle.children[2].material.color = { r: 1, g: 0, b: 0 };
      reticle.children[2].material.transparent = true;
      reticle.children[2].material.opacity = 0.1;
      reticle.visible = false;
      scene.add(reticle);
    }
  );

  let chair;
  loader.load(
    "https://raw.githubusercontent.com/Midnightfury/3Dmodels/main/gltfModels/office_chair/scene.gltf",
    function (gltf) {
      chair = gltf.scene;
      chair.scale.set(0.5, 0.5, 0.5);
      chair.castShadow = true;
      chair.receiveShadow = false;
    }
  );

  let visibleReticle = true;
  const objectPlacementBtn = document.querySelector("#object-placement");
  objectPlacementBtn.addEventListener("click", (event) => {
    if (chair && visibleReticle) {
      const clone = chair.clone();
      clone.position.copy(reticle.position);
      scene.add(clone);

      objects.push(clone);
      if (objects.length > MAX_OBJECTS) {
        let oldObject = objects.shift();
        scene.remove(oldObject);
      }

      shadowPlane.position.y = clone.position.y;
    }
    reticle.visible = false;
    visibleReticle = false;
  });

  const enableTrackingBtn = document.querySelector("#enable-tracking");
  enableTrackingBtn.addEventListener("click", function () {
    if (!visibleReticle) {
      visibleReticle = true;
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
      renderer.setSize(viewport.width, viewport.height);

      camera.matrix.fromArray(view.transform.matrix);
      camera.projectionMatrix.fromArray(view.projectionMatrix);
      camera.updateMatrixWorld(true);

      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length > 0 && visibleReticle) {
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

document.querySelector("#start-ar").addEventListener("click", activateAR);
