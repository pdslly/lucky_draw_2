<template>
  <canvas class="canvas" ref="canEl"></canvas>
</template>

<script setup>
import {ref, onMounted} from "vue"
import { setupCanvas } from "@/utils";

var c = null;
var $ = null;
var u = 0;

const canEl = ref(null)

var go = function() {
  var sc, g, g1, i, j, p, x, y, z, w, a, cur,
    d = new Date() / 1000,
    rnd = shift(),
    rnd1 = d,
    rnd2 = 2.4,
    rnd3 = d * 0.2,
    rnd1c = Math.cos(rnd1),
    rnd1s = Math.sin(rnd1),
    rnd2c = Math.cos(rnd2),
    rnd2s = Math.sin(rnd2);

  c.width = window.innerWidth;
  c.height = window.innerHeight;
  sc = Math.max(c.width, c.height);
  $.translate(c.width * 0.5, c.height * 0.5);
  $.scale(sc, sc);
  g = $.createLinearGradient(-1, -2, 1, 2);
  g.addColorStop(0.0, 'hsla(338, 95%, 25%, 1)');
  g.addColorStop(0.5, 'hsla(260, 95%, 5%, 1)');
  g.addColorStop(1.0, 'hsla(338, 95%, 30%, 1)');
  // $.fillStyle = g;
  // $.fillRect(-0.5, -0.5, 1, 1);
  $.globalCompositeOperation = 'lighter';
  $.rotate(rnd3 % Math.PI * 2);
  for (i = 0; i < 300; i += 1) {
    p = rnd();
    x = (p & 0xff) / 128 - 1;
    y = (p >>> 8 & 0xff) / 128 - 1;
    z = (p >>> 16 & 0xff) / 128 - 1;
    w = (p >>> 24 & 0xff) / 256;
    z += d * 0.5;
    z = (z + 1) % 2 - 1;
    a = (z + 1) * 0.5;
    if (a < 0.9) {
      $.globalAlpha = a / 0.7;
    }else {
      a -= 0.9;
      $.globalAlpha = 1 - a / 0.1;
    }
    cur = x * rnd1c + y * rnd1s;
    y = x * rnd1s - y * rnd1c;
    x = cur;
    cur = y * rnd2c + z * rnd2s;
    z = y * rnd2s - z * rnd2c;
    y = cur;
    z -= 0.65;
    if (z >= 0) {
      continue;
    }
    sc = 0.1 / z;
    x *= sc;
    y *= sc;
    $.save();
    g1 = $.createRadialGradient(1, 1, 2, 1, 1, 1);
    g1.addColorStop(0.0, 'hsla('+i+', 70%, 40%,.8)');
    g1.addColorStop(0.5, 'hsla('+i+', 75%, 50%, 1)');
    g1.addColorStop(1.0, 'hsla('+i+', 80%, 60%, .8)');
    $.fillStyle = g1;
    $.translate(x, y);
    $.scale(sc * 0.017, sc * 0.017);
    $.beginPath();
    $.moveTo(2, 0);
    for (j = 0; j < 10; j += 1) {
      $.rotate(Math.PI*2 * 0.1);
      $.lineTo(j % 2 + 1, 0);
    }
    $.arc(10, 10, 1, 0, Math.PI * 2);    
    $.rotate(Math.PI * 2 * 0.1);
    $.closePath();
    $.fill();
    $.restore();
  }
};

var shift = function(x, y, z, w) {
  x = x || 123456789;
  y = y || 362436069;
  z = z || 521288629;
  w = w || 88675123;

  return function() {
    var s = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19)) ^ (s ^ (s >>> 8));
    return w;
  };
}
window.addEventListener('resize', function() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}, false);

var run = function() {
  window.requestAnimationFrame(run);
  go();
}

onMounted(() => {
  c = canEl.value
  $ = setupCanvas(c)
  run();
})
</script>

<style lang="scss" scoped>
.canvas {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1;
  pointer-events: none;
}
</style>