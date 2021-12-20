let directionalLight = document.querySelector("#directional-light");

function MoveLightRight() {
  directionalLight.object3D.position.set(2, 2, 0);
  console.log(directionalLight.object3D.position);
}

function MoveLightLeft() {
  directionalLight.object3D.position.set(-2, 2, 0);
  console.log(directionalLight.object3D.position);
}

function MoveLightTop() {
  directionalLight.object3D.position.set(0, 2, 0);
  console.log(directionalLight.object3D.position);
}

function MoveLightFront() {
  directionalLight.object3D.position.set(0, 1, 2);
  console.log(directionalLight.object3D.position);
}

document.querySelector("#move-light-right").addEventListener("click", MoveLightRight);
document.querySelector("#move-light-left").addEventListener("click", MoveLightLeft);
document.querySelector("#move-light-top").addEventListener("click", MoveLightTop);
document.querySelector("#move-light-front").addEventListener("click", MoveLightFront);
