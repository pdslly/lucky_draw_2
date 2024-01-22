<template>
  <div class="wrap" :style="{ width: `${conW}px` }">
    <div
      ref="conEl"
      class="list"
      :style="{ transform: `translate3D(${offsetX}px, 0, 0)` }"
    >
      <div class="item" v-for="(user, index) in list" :key="user.id">
        <div class="inner" :class="{ rotate: isEnd }">
          <img class="front" :src="user.avatar" :alt="user.name" />
          <div class="back">
            <img class="avatar" :src="user.avatar" :alt="user.name" />
            <strong class="dept">{{ user.department }}</strong>
            <strong class="name">{{ user.name }}</strong>
          </div>
        </div>
      </div>
      <div class="item" v-for="(user, index) in list" :key="user.id">
        <div class="inner" :class="{ rotate: isEnd }">
          <img class="front" :src="user.avatar" :alt="user.name" />
          <div class="back">
            <img class="avatar" :src="user.avatar" :alt="user.name" />
            <strong class="dept">{{ user.department }}</strong>
            <strong class="name">{{ user.name }}</strong>
          </div>
        </div>
      </div>
      <div class="item" v-for="(user, index) in list" :key="user.id">
        <div class="inner" :class="{ rotate: isEnd }">
          <img class="front" :src="user.avatar" :alt="user.name" />
          <div class="back">
            <img class="avatar" :src="user.avatar" :alt="user.name" />
            <strong class="dept">{{ user.department }}</strong>
            <strong class="name">{{ user.name }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineExpose, defineEmits, toRefs } from "vue";
import Tween from "@tweenjs/tween.js";

const props = defineProps({
  list: Array,
  size: Number,
  limit: Number,
});

const { list, size, limit } = toRefs(props);

const emit = defineEmits(["end"]);

let speed = 0;
let startX = 0;
let isStop = false;
let tween = null;
let reqId = 0;

const isEnd = ref(false);
const SIZE = size.value + 30;
const conW = SIZE * (limit.value - 1) + size.value;
const maxLen = SIZE * list.value.length;
const conEl = ref(null);
const imgW = ref(`${size.value}px`);
const offsetX = ref(startX);

function runAnima(time) {
  
  if (isStop) {
    tween.update(time);
  } else {
    if (Math.abs(offsetX.value - startX) >= maxLen) offsetX.value = startX;
    offsetX.value += speed;
  }

  if (!isEnd.value) reqId = requestAnimationFrame(runAnima);
}

function endAnim() {
  isEnd.value = true;

  const scrollX = Math.abs(offsetX.value - startX);
  const index = Math.floor(scrollX / SIZE);
  const n = speed / Math.abs(speed);

  let _ind = list.value.length - index;

  if (n < 0) _ind = list.value.length - _ind;

  const users = [];
  const genIndex = (v) => v % list.value.length;

  for (let index = 0; index < limit.value; index++) {
    users.push(list.value[genIndex(_ind + index)]);
  }

  // users.forEach((user) => {
  //   console.log(user.name);
  // });

  emit("end", users);
}

function stop() {
  isStop = true;

  const scrollX = Math.abs(offsetX.value - startX);
  const remain = scrollX % SIZE;
  const n = speed / Math.abs(speed);
  const coords = { x: 0 };
  const _offsetX = offsetX.value;
  const distance = 2 * SIZE - remain;

  tween = new Tween.Tween(coords, false)
    .to({ x: distance }, 2000)
    .easing(Tween.Easing.Quadratic.Out)
    .onUpdate(() => {
      if (Math.abs(offsetX.value - startX) >= maxLen) offsetX.value = startX;
      offsetX.value = _offsetX + n * coords.x;
      if (coords.x == distance) endAnim();
    })
    .start();
}

function play(num) {
  isStop = false;
  speed = num;
  startX = speed > 0 ? -maxLen : 0;
  offsetX.value = startX;
  runAnima();
}

function reset() {
  cancelAnimationFrame(reqId);
  isEnd.value = false;
}

defineExpose({
  play,
  stop,
  reset,
});
</script>

<style scoped>
.wrap {
  overflow: hidden;
}
.list {
  position: relative;
  white-space: nowrap;
}
.item {
  display: inline-block;
  line-height: 0;
  margin-right: 30px;
}
.inner.rotate {
  transform: rotateY(180deg);
}
.inner.rotate .back {
  display: flex;
}
.inner {
  position: relative;
  transform-style: preserve-3d;
  transition: 500ms;
  width: v-bind(imgW);
  height: v-bind(imgW);
}
.front,
.back {
  position: absolute;
  border-radius: 4px;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
}
.back {
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  transform: rotateY(180deg);
  display: none;
}

.back .detp {
  font-size: 14px;
}

.back .name {
  font-size: 24px;
}

.avatar {
  aspect-ratio: 1/ 1;
  width: 40%;
}
</style>
