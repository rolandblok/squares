function init() {
  squares = new Squares("sqaures");
  squares.animLoop();
}



class Squares {

  constructor(name) {

      this.name = name;
 
      this.canvas = document.getElementById("canvas");
      this.canvas.addEventListener("mousedown", this, false);
      this.canvas.addEventListener("mouseup", this, false);
      this.canvas.addEventListener("mousemove", this, false);
      this.canvas.addEventListener("click", this, false);
      this.canvas.addEventListener("dblclick", this, false);
      //this.canvas.addEventListener("resize", this, false);

      this.canvas.addEventListener('keydown', this, false);
      this.canvas.addEventListener('keyup', this, false);
      this.canvas.addEventListener('wheel', this, false);
      let me = this // this is the-javascript-shiat!  https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
      window.addEventListener( 'resize', function bla(event) {
                console.log("resize " + me.name)
                me.THREEcamera.aspect = window.innerWidth / window.innerHeight;
                me.THREEcamera.updateProjectionMatrix();
                me.renderer.setSize(window.innerWidth, window.innerHeight);
              }, false );

      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      // THREE / GL
      this.three_scene = new THREE.Scene();

      this.fov = 55
      this.THREEcamera = new THREE.PerspectiveCamera( this.fov, 1.33, 0.01, 2000 );
      
      this.THREEcamera.up = new THREE.Vector3(0,   1,  0)
      this.THREEcamera.aspect = window.innerWidth / window.innerHeight;
      this.THREEcamera.fov = this.fov
      this.THREEcamera.position.set(-0, 0, 10)
      this.THREEcamera.lookAt(new THREE.Vector3(0,   0,  0))
      this.THREEcamera.updateProjectionMatrix();
      this.back_color = 0x000000

      this.three_light = new THREE.PointLight( "ffffff", 1, 0 )
      this.three_light.position.set(-0, -0, 10)
      
      this.three_scene.add( this.three_light );

      this.raycaster = new THREE.Raycaster(); 


      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas_g, antialias: true, depth: true});
      this.renderer.setSize( window.innerWidth, window.innerHeight);
      this.canvas = document.body.appendChild(this.renderer.domElement);
      

      // SCENE BUILD
      let N = 25
      this.squares = new Array ()
      for (let i = 0 ; i < N; i ++ ) {
        this.squares[i] = new Array ()
        for (let j = 0 ; j < N; j ++) {
          let size = 0.4
          let square = new Square(this.three_scene, -size*N/2 + i*size, -size*N/2 + j*size, size);
          
          this.squares[i][j] = square
        }
      }
      for (let i = 0 ; i < N; i ++ ) {
        for (let j = 0 ; j < N; j ++) {
          let left   = (i==0) ? this.squares[N-1][j] : this.squares[i-1][j]
          let right  = (i==N-1) ? this.squares[0][j] : this.squares[i+1][j]
          let top    = (j==0) ? this.squares[i][N-1] : this.squares[i][j-1]
          let bottom = (j==N-1) ? this.squares[i][0] : this.squares[i][j+1]
          this.squares[i][j].connect(left, right, top, bottom)
        }
      }

      this.squares[10][10].mesh.rotation.x += 1

      this.last_update_time = null;

  }

  animLoop(cur_time_ms) {
    var me = this; // https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
    //window.requestAnimationFrame(function (cur_time) { me.drawAndUpdate(cur_time); });

    this.stats.begin();

    //update
    if(this.last_update_time_ms != null){
        var d_time_ms = cur_time_ms - this.last_update_time_ms

        for (let i = 0; i < this.squares.length; i++ ) {
          for (let j = 0; j < this.squares[i].length; j++){
            this.squares[i][j].update(d_time_ms)
          }
        }
        for (let i = 0; i < this.squares.length; i++ ) {
          for (let j = 0; j < this.squares[i].length; j++){
            this.squares[i][j].effectuate_update()
          }
        }
        
    }
    this.last_update_time_ms = cur_time_ms;

    // draw
    window.requestAnimationFrame(function (cur_time) { me.animLoop(cur_time); });
    this.render();

    this.stats.end();

  }

  render() {

    this.renderer.render(this.three_scene, this.THREEcamera)

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
    //console.log(" onmousemove : " + e.x + " " + e.y)
    console.log(" onmousemove : ")
  }

  onmousedown(e) {
    console.log(" onmousedown : " + e.x + " " + e.y)
  }
  onmouseup(e) {
    console.log(" onmouseup : " + e.x + " " + e.y)
    // var game_object_ids = this._raycastMouseToTile(e);
  }

  keyDown(e){
    console.log(" keyDown : "+ e.x + " " + e.y)
  }

  keyUp(e){
    console.log(" keyUp : "+ e.x + " " + e.y)
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

        
