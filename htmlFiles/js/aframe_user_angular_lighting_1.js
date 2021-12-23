let lightSlider = document.querySelector("#light-position");
let angularValue = document.querySelector("#angle-value");

angularValue.innerHTML = lightSlider.value + " deg";

let xCoordinate, zCoordinate;

lightSlider.oninput = function () {
  let DegtoRad = this.value * (Math.PI / 180);

  xCoordinate = (2 * Math.cos(DegtoRad)).toFixed(4);
  zCoordinate = (2 * Math.sin(DegtoRad)).toFixed(4);

  angularValue.innerHTML = this.value + " deg";
};

export { xCoordinate, zCoordinate };
