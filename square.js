class Square {

    constructor(three_scene, x, y, size) {
        
        this.size = size
        this.hsize = 0.5 * size
        this.k = 1     // oscilator
        this.c = 0  // demper
        this.m = 0.01  // massa

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

    connect(left, right, top, bottom, left_top, left_bottom, right_top, right_bottom) {
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
        this.left_top = left_top;
        this.left_bottom = left_bottom;
        this.right_top = right_top;
        this.right_bottom = right_bottom;
    }


    // update all tilts from patterns
    update(d_time_ms) {
        let d_time = d_time_ms / 10000

        let force_spring_right_top = this.k * (3 * this.getUitslagRightTop() - this.top.getUitslagRightBottom() - this.right_top.getUitslagLeftBottom() - this.right.getUitslagLeftTop())
        let force_spring_right_bottom = this.k * (3 * this.getUitslagRightBottom() - this.bottom.getUitslagRightTop() - this.right_bottom.getUitslagLeftTop() - this.right.getUitslagLeftBottom())
        let force_spring_left_top = this.k * (3 * this.getUitslagLeftTop() - this.top.getUitslagLeftBottom() - this.left_top.getUitslagRightBottom() - this.left.getUitslagRightTop())
        let force_spring_left_bottom = this.k * (3 * this.getUitslagLeftBottom() - this.bottom.getUitslagLeftTop() - this.left_bottom.getUitslagRightTop() - this.left.getUitslagRightBottom())

        let force_damp_right_top = this.c * (3 * this.getVRightTop() - this.top.getVRightBottom() - this.right_top.getVLeftBottom() - this.right.getVLeftTop())
        let force_damp_right_bottom = this.c * (3 * this.getVRightBottom() - this.bottom.getVRightTop() - this.right_bottom.getVLeftTop() - this.right.getVLeftBottom())
        let force_damp_left_top = this.c * (3 * this.getVLeftTop() - this.top.getVLeftBottom() - this.left_top.getVRightBottom() - this.left.getVRightTop())
        let force_damp_left_bottom = this.c * (3 * this.getVLeftBottom() - this.bottom.getVLeftTop() - this.left_bottom.getVRightTop() - this.left.getVRightBottom())

        // kracht vergelijking:
        let total_force_spring_right = force_spring_right_top + force_spring_right_bottom - force_spring_left_top - force_spring_left_bottom
        let total_force_damp_right = force_damp_right_top + force_damp_right_bottom - force_damp_left_top - force_damp_left_bottom
        let a_right = (total_force_spring_right + total_force_damp_right) / -this.m;
        let dv_right = a_right * d_time
        let dx_right = (this.getVRight() + dv_right) * d_time

        this.next_rotation_y = this.mesh.rotation.y + dx_right / this.hsize
        this.next_v_Ry = this.v_Ry + dv_right / this.hsize;


        // kracht vergelijking:
        let total_force_spring_top = force_spring_right_top - force_spring_right_bottom + force_spring_left_top - force_spring_left_bottom
        let total_force_damp_top = force_damp_right_top - force_damp_right_bottom + force_damp_left_top - force_damp_left_bottom
        let a_top = (total_force_spring_top + total_force_damp_top) / -this.m;
        let dv_top = a_top * d_time
        let dy_top = (this.getVTop() + dv_top) * d_time

        this.next_rotation_x = this.mesh.rotation.x + dy_top / this.hsize
        this.next_v_Rx = this.v_Rx + dv_top / this.hsize;

    /*
       let total_force_spring_right_top = force_spring_right_top - force_spring_right_bottom - force_spring_left_top + force_spring_left_bottom
       let total_force_damp_right_top = force_damp_right_top - force_damp_right_bottom - force_damp_left_top + force_damp_left_bottom
       let a_right_top = (total_force_spring_right_top + total_force_damp_right_top) / -this.m;
       let a_right = a_right_top * Math.sqrt(0.5)
       let a_top = a_right_top * Math.sqrt(0.5)

       let dv_right = a_right * d_time
       let dx_right = (this.getVRight() + dv_right) * d_time
       let dv_top = a_top * d_time
       let dy_top = (this.getVTop() + dv_top) * d_time

       this.next_rotation_y = this.mesh.rotation.y + dx_right / this.hsize
       this.next_v_Ry = this.v_Ry + dv_right / this.hsize;
       this.next_rotation_x = this.mesh.rotation.x + dy_top / this.hsize
       this.next_v_Rx = this.v_Rx + dv_top / this.hsize;
       */
 }

    effectuate_update() {
        this.mesh.rotation.x = this.next_rotation_x
        this.mesh.rotation.y = this.next_rotation_y
        this.v_Rx = this.next_v_Rx
        this.v_Ry = this.next_v_Ry
    }

    getUitslagRightBottom() {
        return (-this.mesh.rotation.x + this.mesh.rotation.y) * this.hsize
    }
    getUitslagRightTop() {
        return (this.mesh.rotation.x + this.mesh.rotation.y) * this.hsize
    }
    getUitslagLeftTop() {
        return (this.mesh.rotation.x - this.mesh.rotation.y) * this.hsize
    }
    getUitslagLeftBottom() {
        return (-this.mesh.rotation.x - this.mesh.rotation.y) * this.hsize
    }

    getVRightBottom() {
        return (-this.v_Rx + this.v_Ry) * this.hsize
    }
    getVRightTop() {
        return (this.v_Rx + this.v_Ry) * this.hsize
    }
    getVLeftTop() {
        return (this.v_Rx - this.v_Ry) * this.hsize
    }
    getVLeftBottom() {
        return (-this.v_Rx - this.v_Ry) * this.hsize
    }
    getVRight() {
        return this.v_Ry * this.hsize
    }
    getVTop() {
        return this.v_Rx * this.hsize
    }

    getEnergy() {
        let kinetic_rx = this.v_Rx*this.v_Rx
        let kinetic_ry = this.v_Rx*this.v_Rx
        let spring
    }

}