<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ text: string }>();
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text);
  } catch {
    // 剪贴板 API 不可用时降级
    const ta = document.createElement('textarea');
    ta.value = props.text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <button
    type="button"
    class="px-3 py-1.5 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-500 transition-colors"
    @click="copy"
  >
    {{ copied ? '已复制 ✓' : '复制' }}
  </button>
</template>
