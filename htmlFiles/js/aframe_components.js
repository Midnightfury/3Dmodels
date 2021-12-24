AFRAME.registerComponent("touch-movement", {
  init: function () {
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    document.addEventListener("touchend", this.onTouchEnd);
    document.addEventListener("touchmove", this.onTouchMove);
  },
  onTouchMove: function (evt) {
    if (evt.touches.length === 1) {
      this.onSingleTouchMove(evt);
    }
    if (evt.touches.length === 2) {
      this.onPinchMove(evt);
    }
  },
  onSingleTouchMove: function (evt) {
    var dX;
    var dY;
    var modelPivotEl = this.el;

    this.oldClientX = this.oldClientX || evt.touches[0].clientX;
    this.oldClientY = this.oldClientY || evt.touches[0].clientY;

    dX = this.oldClientX - evt.touches[0].clientX;
    dY = this.oldClientY - evt.touches[0].clientY;

    modelPivotEl.object3D.rotation.y -= dX / 50;
    this.oldClientX = evt.touches[0].clientX;

    modelPivotEl.object3D.rotation.x -= dY / 100;
    this.oldClientY = evt.touches[0].clientY;

    // Clamp x rotation to [-90,90]
    modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);
  },
  onPinchMove: function (evt) {
    var dX = evt.touches[0].clientX - evt.touches[1].clientX;
    var dY = evt.touches[0].clientY - evt.touches[1].clientY;

    var modelPivotEl = this.el;
    var distance = Math.sqrt(dX * dX + dY * dY);

    var oldDistance = this.oldDistance || distance;
    var distanceDifference = oldDistance - distance;
    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;

    modelScale -= distanceDifference / 200;
    // Clamp scale.
    modelScale = Math.min(Math.max(0.3, modelScale), 2.5);

    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);

    this.modelScale = modelScale;
    this.oldDistance = distance;
  },
  onTouchEnd: function (evt) {
    this.oldClientX = undefined;
    this.oldClientY = undefined;
    if (evt.touches.length < 2) {
      this.oldDistance = undefined;
    }
  },
});

AFRAME.registerComponent("mouse-movement", {
  init: function () {
    this.oldClientX = 0;
    this.oldClientY = 0;
    this.modelScale = 1;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);

    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("wheel", this.onMouseWheel);
  },
  onMouseMove: function (evt) {
    var dX;
    var dY;
    var modelPivotEl = this.el;

    dX = this.oldClientX - evt.clientX;
    dY = this.oldClientY - evt.clientY;

    modelPivotEl.object3D.rotation.y -= dX / 50;
    modelPivotEl.object3D.rotation.x -= dY / 100;

    // Clamp x rotation to [-90,90]
    modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);

    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  },
  onMouseWheel: function (evt) {
    var modelPivotEl = this.el;

    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;

    modelScale -= evt.deltaY / 100;

    //Clamp model Scale
    modelScale = Math.min(Math.max(0.3, modelScale), 2.5);

    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);

    this.modelScale = modelScale;
  },
});
