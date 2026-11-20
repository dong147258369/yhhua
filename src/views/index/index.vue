<script setup lang="ts">
import ItemWrap from "@/components/item-wrap";
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="运河沿线8省市智创活力榜"
        style="padding: 0 10px 12px 10px"
      >
        <LeftBottom />
      </ItemWrap>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="运河数字经济核心总览">
        <LeftTop />
      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="运河六大核心产业布局">
        <LeftCenter />
      </ItemWrap>
    </div>

    <div class="contetn_center">
      <CenterMap class="contetn_center_top" title="京杭大运河数字孪生与协同走廊" />
      <ItemWrap class="contetn_center-bottom" title="运河沿岸成果转化与数字经济趋势">
        <CenterBottom />
      </ItemWrap>
    </div>

    <div class="contetn_right">
      <ItemWrap
        class="contetn_lr-item"
        title="运河沿线城市智创实时动态"
        style="padding: 0 10px 12px 10px"
      >
        <RightBottom />
      </ItemWrap>
      <ItemWrap class="contetn_lr-item" title="大运河五维数智赋能评估">
        <RightTop />
      </ItemWrap>
      <ItemWrap class="contetn_lr-item" title="运河数字化与绿色航运指标">
        <RightCenter />
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.contetn_center {
  flex: 1;
  margin: 0 36px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
