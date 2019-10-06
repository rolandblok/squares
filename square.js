class Square {

    constructor(three_scene, x, y, size) {
        let three_material = new THREE.MeshPhongMaterial( {color:"#aaaaaa"} );
              
        let geometry_template = new THREE.PlaneBufferGeometry( 0.99*size, 0.99*size  );
        this.mesh = new THREE.Mesh( geometry_template, three_material );

        this.mesh.position.x = x + 0.005*size
        this.mesh.position.y = y + 0.005*size

        three_scene.add(this.mesh)

    }

}