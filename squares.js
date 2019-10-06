function init() {
  squares = new Squares("sqaures");
  squares.animLoop();
}


class Squares {

  constructor(name) {

      this.name = name;
      this.canvas_gl = document.getElementById("canvas_gl");
      this.canvas_gl.addEventListener("mousedown", this, false);
      this.canvas_gl.addEventListener("mouseup", this, false);
      this.canvas_gl.addEventListener("mousemove", this, false);
      this.canvas_gl.addEventListener("click", this, false);
      this.canvas_gl.addEventListener("dblclick", this, false);
      this.canvas_gl.addEventListener("resize", this, false);
      window.addEventListener('resize', function bla(event){this.resize()})
      this.canvas_gl.addEventListener('keydown', this, false);
      this.canvas_gl.addEventListener('keyup', this, false);
      this.canvas_gl.addEventListener('wheel', this, false);
      //this.ctx = canvas.getContext("2d");

      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      // THREE / GL
      this.three_scene = new THREE.Scene();

      this.fov = 55
      this.THREEcamera = new THREE.PerspectiveCamera( this.fov, 1.33, 0.01, 2000 );
      
      this.THREEcamera.up = new THREE.Vector3(0,   0,   1)
      this.THREEcamera.aspect = window.innerWidth / window.innerHeight;
      this.THREEcamera.fov = this.fov
      this.THREEcamera.position.set(-10, 0, 0)
      this.THREEcamera.lookAt(new THREE.Vector3(0,   0,  0))
      this.THREEcamera.updateProjectionMatrix();
      this.back_color = 0x000000

      this.three_light = new THREE.PointLight( "ffffff", 1, 0 )
      this.three_light.position.set(-10, -0, -0)
      
      this.three_scene.add( this.three_light );

      this.raycaster = new THREE.Raycaster(); 

              // box
              //var texture_loader = new THREE.TextureLoader()
              //var texture = texture_loader.load( 'img/animal.cavia.32.01.png' );
              let material = new THREE.MeshPhongMaterial( {color:"#00ff00"} );
              let geometry = new THREE.BoxGeometry(1, 1 , 1);
              this.mesh_box = new THREE.Mesh( geometry, material );
              this.three_scene.add(  this.mesh_box );

      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas_gl, antialias: true, depth: true});
      this.renderer.setSize( window.innerWidth, window.innerHeight);

      this.last_update_time = null;

  }

  animLoop(cur_time_ms) {
    var me = this; // https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
    //window.requestAnimationFrame(function (cur_time) { me.drawAndUpdate(cur_time); });

    this.stats.begin();

    //update
    if(this.last_update_time_ms != null){
        var d_time_ms = cur_time_ms - this.last_update_time_ms
    }
    this.last_update_time_ms = cur_time_ms;

    // draw
    window.requestAnimationFrame(function (cur_time) { me.animLoop(cur_time); });
    this.render();

    this.stats.end();

  }

  render() {

    
    this.mesh_box.rotation.x += 0.004;
    this.mesh_box.rotation.y += 0.008;


    this.renderer.render(this.three_scene, this.THREEcamera)

  }


      
  resize() {
    //this.canvas.width = window.innerWidth;
    //this.canvas.height = window.innerHeight;
    this.THREEcamera.aspect = window.innerWidth / window.innerHeight;
    this.THREEcamera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }


  _raycastMouseToTile(e){
    // some raycasting to deterimine the active tile.
    this.mouse_position.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse_position.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse_position, this.camera.THREEcamera);
    var intersects = this.raycaster.intersectObjects( this.three_scene.children );

    return intersects.map(x => x.object.name);
  }


  onmousemove(e) {
  }

  onmousedown(e) {
  }
  onmouseup(e) {
    // var game_object_ids = this._raycastMouseToTile(e);
  }


  keyDown(e){
      if (e.key == 'a') {console.log("a down")}
  }

  keyUp(e){
    if (e.key == 'a') {console.log("a up")}
  }

  wheel(e){
      console.log(" w " + e.deltaX + " " + e.deltaY + " " + e.deltaZ + " " + e.deltaMode)
  }

  handleEvent(evt) {
      //console.log("event type " + evt.type)
      switch (evt.type) {
          case "wheel":
              this.wheel(evt);
              break;
          case "keydown":
              this.keyDown(evt)
              break;
          case "resize":
              this.resize()
              break;
          case "mousemove":
              //mouse move also fires at click...
              this.onmousemove(evt);
              break;
          case "mousedown":
              this.onmousedown(evt);
              break;
          case "mouseup":
              this.onmouseup(evt);
              break;
          case "dblclick":
              break;
          case "keydown":
              this.keyDown(evt);
              break;
          case "keyup":
              this.keyUp(evt);
              break;
          default:
              return;
      }
  }


}
