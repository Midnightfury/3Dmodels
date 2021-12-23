let directionalLight = document.querySelector("#directional-light");
let lightSlider = document.querySelector("#light-position");

let angularValue = document.querySelector("#angle-value");
//let xDirectionValue = document.querySelector("#x-position-value");
//let zDirectionValue = document.querySelector("#z-position-value");

angularValue.innerHTML = lightSlider.value + " deg";

lightSlider.oninput = function () {
  let DegtoRad = this.value * (Math.PI / 180);

  directionalLight.object3D.position.x = (2 * Math.cos(DegtoRad)).toFixed(4);
  directionalLight.object3D.position.z = (2 * Math.sin(DegtoRad)).toFixed(4);

  //xDirectionValue.innerHTML = directionalLight.object3D.position.x;
  //zDirectionValue.innerHTML = directionalLight.object3D.position.z;
  angularValue.innerHTML = this.value + " deg";
};
