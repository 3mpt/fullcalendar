<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { defineProps } from "vue"; // 导入 Composition API 中的 defineProps 函数

// 使用 defineProps 定义 props
/* const props = defineProps({
  name: String // 定义名为 name 的 String 类型的 props
}); */
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>