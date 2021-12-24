let directionalLight = document.querySelector("#directional-light");
let lightSlider = document.querySelector("#light-position");

let angularValue = document.querySelector("#angle-value");

angularValue.innerHTML = lightSlider.value + " deg";

lightSlider.oninput = function () {
  let DegtoRad = this.value * (Math.PI / 180);

  directionalLight.object3D.position.x = (2 * Math.cos(DegtoRad)).toFixed(4);
  directionalLight.object3D.position.z = (2 * Math.sin(DegtoRad)).toFixed(4);

  angularValue.innerHTML = this.value + " deg";
};
