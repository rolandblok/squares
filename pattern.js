var uniqueID = (function() {
    var id = 0; // This is the private persistent value
    // The outer function returns a nested function that has access
    // to the persistent value.  It is this nested function we're storing
    // in the variable uniqueID above.
    return function() { return id++; };  // Return and increment
 })(); // Invoke the outer function after defining it.


 class Pattern {
     constructor() {
        this.time_ms = 0
        this.id = uniqueID();
     }

     getTilts(x,y) {
        let tilts = {}
        tilts.rx = 0;
        tilts.ry = 0
        return tilts
     }

     update(d_time_ms) {
         this.time_ms += d_time_ms
     }

     died() {
         return false;
     }
 }