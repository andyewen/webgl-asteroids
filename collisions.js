function crossProduct(v1, v2) {
  return (v1[0] * v2[1]) - (v1[1] * v2[0]);
}

function linesIntersect(l1, l2) {
  var p = vec2.clone(l1[0]),
      r = vec2.clone(l1[1]),
      q = vec2.clone(l2[0]),
      s = vec2.clone(l2[1]);
  // r and s are now each lines direction and magnitude.
  vec2.subtract(r, r, p);
  vec2.subtract(s, s, q);

  var d = crossProduct(r, s);
  if (d == 0) {
    return false;
  }

  var t = vec2.clone(q);
  vec2.subtract(t, t, p);
  t = crossProduct(t, s);
  t /= d;
  // Could return early here...
  var u = vec2.clone(q);
  vec2.subtract(u, u, p);
  u = crossProduct(u, r);
  u /= d;

  return (t >= 0 && t <= 1 && u >= 0 && u <= 1);
}

var collideAlert = (function() {
  var last = null;
  return function() {
    var now = new Date();
    if (!last || now - last >= 200) {
      last = now;
      console.log("Collision!");
    }
  }
})();
