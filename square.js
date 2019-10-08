class Square {

    constructor(three_scene, x, y, size) {
        
        this.size = size
        this.hsize = 0.5 * size
        this.k = 10
        this.c = 0
        this.m = 10000

        let three_material = new THREE.MeshPhongMaterial( {color:"#aaaaaa"} );
              
        let geometry_template = new THREE.PlaneBufferGeometry( 0.9*size, 0.99*size  );
        this.mesh = new THREE.Mesh( geometry_template, three_material );

        this.mesh.position.x = x
        this.mesh.position.y = y

        this.v_right = 0
        this.v_top = 0

        three_scene.add(this.mesh)

        this.id = ""+x+"_"+y

    }

    connect(left, right, top, bottom) {
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
    }


    // update all tilts from patterns
    update(d_time_ms) {
        
        // for x axis
        let x_right =  this.getUitslagX() + this.right.getUitslagX()
        let x_left  = -this.getUitslagX() - this.left.getUitslagX()
        let a_right = (-this.c/this.m)*this.v_right + this.k * (x_right - x_left)
        let dv_right = a_right * d_time_ms
        this.v_right += dv_right
        let dx_right = this.v_right * d_time_ms
        this.d_rotation_x = dx_right / this.hsize

        // for y axis
        let y_top =  this.getUitslagY() + this.top.getUitslagY()
        let y_bottom  = -this.getUitslagY() - this.bottom.getUitslagY()
        let a_top = (-this.c/this.m)*this.v_top + this.k * (y_top - y_bottom)
        let dv_top = a_top * d_time_ms
        this.v_top += dv_top
        let dy_top = this.v_top * d_time_ms
        this.d_rotation_y = dy_top / this.hsize


    }

    effectuate_update() {
        this.mesh.rotation.x += this.d_rotation_x
        this.mesh.rotation.y += this.d_rotation_y
    }

    getUitslagY() {
        return this.mesh.rotation.x * this.hsize
    }
    getUitslagX() {
        return this.mesh.rotation.y * this.hsize
    }


}