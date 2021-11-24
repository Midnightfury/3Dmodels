const modelViewer = document.querySelector("#model-viewer");

modelViewer.addEventListener("load", function () {
  const center = modelViewer.getCameraTarget();
  const size = modelViewer.getDimensions();

  const x2 = size.x / 2;
  const y2 = size.y / 2;
  const z2 = size.z / 2;

  modelViewer.updateHotspot({
    name: "hotspot-dim+X-Y",
    position: `${center.x + x2} ${center.y - y2} ${center.z}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent = `${(
    size.z * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dim+X-Z",
    position: `${center.x + x2} ${center.y} ${center.z - z2}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent = `${(
    size.y * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dim+Y-Z",
    position: `${center.x} ${center.y + y2} ${center.z - z2}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent = `${(
    size.x * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dim-X-Z",
    position: `${center.x - x2} ${center.y} ${center.z - z2}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent = `${(
    size.y * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dim-X-Y",
    position: `${center.x - x2} ${center.y - y2} ${center.z}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent = `${(
    size.z * 100
  ).toFixed(0)} cm`;
});
