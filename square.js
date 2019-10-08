class Square {

    constructor(three_scene, x, y, size) {
        
        this.patterns = {}

        let three_material = new THREE.MeshPhongMaterial( {color:"#aaaaaa"} );
              
        let geometry_template = new THREE.PlaneBufferGeometry( 0.9*size, 0.99*size  );
        this.mesh = new THREE.Mesh( geometry_template, three_material );

        this.mesh.position.x = x
        this.mesh.position.y = y

        three_scene.add(this.mesh)

    }

    addPattern(pattern) {
        this.patterns[pattern.id] = pattern;
    }

    // update all tilts from patterns
    update(d_time_ms) {
        this.mesh.rotation.x = 0
        this.mesh.rotation.y = 0
        for (let [key, pattern] of Object.entries(this.patterns)) {

            if (pattern.died()) {
                delete(this.pattern[key])              
            } else {
                let tilts = pattern.getTilts( this.mesh.position.x,  this.mesh.position.y);
                this.mesh.rotation.x += tilts.rx
                this.mesh.rotation.y += tilts.ry
            }
        }


    }



}