<script setup lang="ts">
import { ref } from 'vue';
import CopyButton from '../../components/CopyButton.vue';
import { formatJSON, minifyJSON, type JsonResult } from './logic';

// —— 状态 ——
const input = ref('');
const result = ref<JsonResult | null>(null);

// 粘贴即处理（PRD：输入类工具默认聚焦、粘贴即格式化）
function onInput() {
  const text = input.value.trim();
  if (!text) {
    result.value = null;
    return;
  }
  result.value = formatJSON(text);
}

function doMinify() {
  if (!input.value.trim()) return;
  result.value = minifyJSON(input.value.trim());
}

function useOutput() {
  if (result.value?.ok) input.value = result.value.output;
}

const hasOutput = () => result.value?.ok === true;
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <label for="json-input" class="block text-sm font-medium mb-1">输入</label>
        <textarea
          id="json-input"
          v-model="input"
          autofocus
          spellcheck="false"
          placeholder='在此粘贴 JSON，如 {"a":1}'
          class="w-full h-72 p-3 font-mono text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent resize-y"
          @input="onInput"
        ></textarea>
      </div>
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-sm font-medium">输出</label>
          <div class="flex gap-2">
            <button
              type="button"
              class="px-2.5 py-1 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              :disabled="!hasOutput()"
              @click="doMinify"
            >
              压缩
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              :disabled="!hasOutput()"
              @click="useOutput"
            >
              回填输入
            </button>
            <CopyButton v-if="result?.ok" :text="result.output" />
          </div>
        </div>
        <pre
          v-if="result?.ok"
          class="w-full h-72 p-3 font-mono text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-auto whitespace-pre-wrap break-all"
        >{{ result.output }}</pre>
        <div
          v-else
          class="w-full h-72 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-400"
        >
          格式化结果将显示在这里
        </div>
      </div>
    </div>

    <!-- 错误提示：带行号与原因（PRD：错误友好） -->
    <div v-if="result && !result.ok" class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm">
      <p class="font-medium text-red-600 dark:text-red-400">JSON 语法错误</p>
      <p class="mt-1 text-red-600/90 dark:text-red-400/90 font-mono break-all">
        {{ result.error.message }}
      </p>
      <p v-if="result.error.line" class="mt-1 text-red-600/90 dark:text-red-400/90">
        位置：第 {{ result.error.line }} 行
      </p>
    </div>
  </div>
</template>
