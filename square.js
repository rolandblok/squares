class Square {

    constructor(three_scene, x, y, size) {
        
        this.size = size
        this.hsize = 0.5 * size
        this.k = 1     // oscilator
        this.c = 0.001  // demper
        this.m = 0.001  // massa

        let three_material = new THREE.MeshPhongMaterial( {color:"#aaaaaa"} );
              
        let geometry_template = new THREE.PlaneBufferGeometry( 0.9*size, 0.99*size  );
        this.mesh = new THREE.Mesh( geometry_template, three_material );

        this.mesh.position.x = x
        this.mesh.position.y = y

        this.v_Rx = 0
        this.v_Ry = 0

        three_scene.add(this.mesh)

        this.id = ""+x+"_"+y


        this.next_rotation_x = 0 
        this.next_rotation_y = 0 
        this.next_v_Rx = 0
        this.next_v_Ry = 0
    }

    connect(left, right, top, bottom) {
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
    }


    // update all tilts from patterns
    update(d_time_ms) {
        let d_time = d_time_ms / 10000

        let x_right = this.getUitslagRight() - this.right.getUitslagLeft()
        let x_left  = this.getUitslagLeft() - this.left.getUitslagRight()
        let v_right = this.getVRight() - this.right.getVLeft()
        let v_left  = this.getVLeft() - this.left.getVRight()
        // kracht vergelijking:
        let a_right = (this.k * (x_right - x_left) + this.c * (v_right - v_left) ) / (-this.m)
        let dv_right = a_right * d_time
        let dx_right = (this.getVRight() + dv_right) * d_time

        this.next_rotation_y = this.mesh.rotation.y + dx_right / this.hsize
        this.next_v_Ry = this.v_Ry + dv_right / this.hsize;


        let y_top = this.getUitslagTop() - this.top.getUitslagBottom()
        let y_bot = this.getUitslagBottom() - this.bottom.getUitslagTop()
        let v_top = this.getVTop() - this.top.getVBottom()
        let v_bot = this.getVBottom() - this.bottom.getVTop()
        // kracht vergelijking:
        let a_top = (this.k * y_top - this.k * y_bot + this.c * v_top - this.c * v_bot ) / (-this.m)
        let dv_top = a_top * d_time
        let dy_top = (this.getVTop() + dv_top) * d_time

        this.next_rotation_x = this.mesh.rotation.x + dy_top / this.hsize
        this.next_v_Rx = this.v_Rx + dv_top / this.hsize;

        
    }

    effectuate_update() {
        this.mesh.rotation.x = this.next_rotation_x
        this.mesh.rotation.y = this.next_rotation_y
        this.v_Rx = this.next_v_Rx
        this.v_Ry = this.next_v_Ry

    }

    getUitslagRight() {
        return  this.mesh.rotation.y * this.hsize
    }
    getUitslagLeft() {
        return -this.mesh.rotation.y * this.hsize
    }
    getUitslagTop() {
        return this.mesh.rotation.x * this.hsize
    }
    getUitslagBottom() {
        return -this.mesh.rotation.x * this.hsize
    }

    getVRight() {
        return  this.v_Ry * this.hsize
    }
    getVLeft() {
        return -this.v_Ry * this.hsize
    }
    getVTop() {
        return this.v_Rx * this.hsize
    }
    getVBottom() {
        return -this.v_Rx * this.hsize
    }


}