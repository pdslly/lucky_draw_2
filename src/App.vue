<template>
  <main class="main">
    <FitScreen style="position: relative; z-index: 10" :width="1920" :height="1080" mode="fit">
      <div class="container">
        <el-button @click="luckyVisible = true">中奖名单</el-button>
        <img
          v-if="isRuning"
          src="./assets/icon/end.png"
          @click="endLottery"
          class="btn"
        />
        <img
          v-if="!isRuning && prizeList.length"
          src="./assets/icon/start.png"
          @click="startLottery"
          class="btn"
        />
        <photo-slide
          v-if="prizeList.length == 0"
          ref="slide$3"
          @end="(v) => handleEndThree(v, staffsList)"
          :list="staffsList"
          :size="340"
          :limit="1"
        ></photo-slide>
        <template v-else>
          <photo-slide
            ref="slide$1"
            @end="(v) => handleEndOne(v, staff$1List)"
            :list="staff$1List"
            :size="200"
            :limit="5"
          ></photo-slide>
          <photo-slide
            ref="slide$2"
            @end="(v) => handleEndTwo(v, staff$2List)"
            :list="staff$2List"
            :size="200"
            :limit="5"
          ></photo-slide>
        </template>
      </div>
    </FitScreen>
    <el-dialog
      v-model="luckyVisible"
      width="1000px"
      title="当前中奖名单"
    >
      <div class="lucky_wrap">
        <div v-for="(prize, index) in drawnList" :key="index">
          <div class="tit">{{prize.name}} <small>({{prize.description}})</small></div>
          <div class="list">
            <h3 v-if="!prize.users.length">暂无数据</h3>
            <div v-else v-for="(user, ind) in prize.users" class="user">
              <img :src="user.avatar" />
              <el-tooltip
                effect="dark"
                :content="user.department"
                placement="top"
              >
                <strong class="detp">{{user.department}}</strong>
              </el-tooltip>
              <strong class="name">{{user.name}}</strong>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
      title="当前抽奖"
    >
      <div class="prize_wrap">
        <strong class="desc">{{ curPrize.description }}</strong>
        <el-button size="large" type="success" plain @click="prizeBtnClick"
          >开始抽奖</el-button
        >
      </div>
    </el-dialog>
    <audio class="audio" preload="auto" ref="audioEl" controls autoplay loop>
      <source :src="audioSrc" />
      你的浏览器不支持audio标签
    </audio>
    <Confetto ref="confettoEl"></Confetto>
    <FloatStar v-show="!isEnd"></FloatStar>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import prize from "@/config/prize.js";
import { staff$1, staff$2, staffs } from "@/config/staff.js";
import Confetto from "@/components/confetto.vue";
import PhotoSlide from "@/components/photoSlide.vue";
import FloatStar from "@/components/floatStar.vue";

import Bgmp3 from "@/assets/bg.mp3";
import Beginmp3 from "@/assets/begin.mp3";

const luckyIds_1 = [];
const luckyIds_2 = [];
const luckyIds_3 = [];

const curPrize = ref(null);
const isRuning = ref(false);
const isEnd = ref(true);
const dialogVisible = ref(false);
const luckyVisible = ref(false)
const staff$1List = ref(staff$1);
const staff$2List = ref(staff$2);
const staffsList = ref(staffs);
const prizeList = ref(prize);
const drawnList = ref([]);
const confettoEl = ref(null);
const audioEl = ref(null);
const audioSrc = ref("");
const slide$1 = ref(null);
const slide$2 = ref(null);
const slide$3 = ref(null);

function startLottery() {
  if (dialogVisible.value) return;

  curPrize.value = prizeList.value.pop();
  drawnList.value.push(curPrize.value);

  slide$1.value?.reset();
  slide$2.value?.reset();
  slide$3.value?.reset();

  staff$1List.value = staff$1List.value.filter(
    (v, index) => !luckyIds_1.includes(v.id)
  );

  staff$2List.value = staff$2List.value.filter(
    (v, index) => !luckyIds_2.includes(v.id)
  );

  staffsList.value = staffsList.value.filter(
    (v, index) => !luckyIds_3.includes(v.id)
  );

  dialogVisible.value = true;
}

function endPrize() {
  isRuning.value = false;
  playAudio(Bgmp3);
}

function handleEndOne(users, list) {
  const ids = users.map((v) => v.id);

  curPrize.value.users.push(...users)
  luckyIds_1.push(...ids);
  luckyIds_3.push(...ids);

  endPrize();
}

function handleEndTwo(users, list) {
  const ids = users.map((v) => v.id);

  curPrize.value.users.push(...users)
  luckyIds_2.push(...ids);
  luckyIds_3.push(...ids);

  endPrize();
}

function handleEndThree(users, list) {
  const ids = users.map((v) => v.id);

  curPrize.value.users.push(...users)
  luckyIds_3.push(...ids);

  endPrize();
}

function playAudio(mp3) {
  audioSrc.value = mp3;
  audioEl.value.load();
  setTimeout(() => {
    audioEl.value.play();
  });
}

function endLottery() {
  if (isEnd.value) return;
  isEnd.value = true;
  slide$1.value?.stop();
  slide$2.value?.stop();
  slide$3.value?.stop();
  confettoEl.value.play();
}

function prizeBtnClick() {
  if (isRuning.value) return;

  isEnd.value = false;
  dialogVisible.value = false;

  slide$1.value?.play(60);
  slide$2.value?.play(-60);
  slide$3.value?.play(60);
  playAudio(Beginmp3);

  isRuning.value = true;
}

window.addEventListener("click", function playMusic() {
  playAudio(Bgmp3);
  window.removeEventListener("click", playMusic);
});

onMounted(() => {
  slide$1.value.play(2);
  slide$2.value.play(-2);
  // playAudio(Bgmp3);
});
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}

.lucky_wrap {
  .tit {
    font-size: 24px;
  }
  .list {
    margin: 20px 0;
    display: flex;
    align-items: center;
    column-gap: 18px;
    .user {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 6px;
      width: 80px;
      img {
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 80px;
      }
      .detp {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        text-align: center;
      }
      .name {
        font-size: 18px;
      }
    }
  }
}

.prize_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 30px;
  strong {
    font-size: 24px;
  }
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 50px;
}
.audio {
  position: absolute;
  top: -100%;
}
.btn {
  position: absolute;
  width: 180px;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  cursor: pointer;
}
.lucky-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
}
</style>
