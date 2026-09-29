<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import CopyButton from '../../components/CopyButton.vue';
import { generatePassword, estimateStrength, poolSizeOf, type PasswordOptions } from './logic';

// —— 状态 ——
const options = reactive<PasswordOptions>({
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
});

const password = ref('');

// 打开即生成一条（PRD：3 秒原则）
function refresh() {
  password.value = generatePassword(options);
}
refresh();

// —— 派生 ——
const poolSize = computed(() => poolSizeOf(options));
const strength = computed(() => estimateStrength(password.value, poolSize.value));
const strengthMeta = computed(() =>
  strength.value === 'weak'
    ? { label: '较弱', bar: 'w-1/4 bg-red-500', text: 'text-red-500' }
    : strength.value === 'medium'
      ? { label: '一般', bar: 'w-2/4 bg-amber-500', text: 'text-amber-500' }
      : { label: '很强', bar: 'w-full bg-emerald-500', text: 'text-emerald-500' },
);
const noCharset = computed(() => poolSize.value === 0);

const labels: { key: keyof PasswordOptions; label: string }[] = [
  { key: 'lowercase', label: '小写字母 (a-z)' },
  { key: 'uppercase', label: '大写字母 (A-Z)' },
  { key: 'numbers', label: '数字 (0-9)' },
  { key: 'symbols', label: '符号 (!@#$…)' },
  { key: 'excludeAmbiguous', label: '排除易混淆字符 (l 1 I O 0)' },
];
</script>

<template>
  <div class="space-y-6">
    <!-- 输出区 -->
    <div class="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <code class="text-xl font-mono break-all">{{ password || '请至少选择一种字符类型' }}</code>
        <div class="flex gap-2 shrink-0">
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            @click="refresh"
          >
            重新生成
          </button>
          <CopyButton v-if="password" :text="password" />
        </div>
      </div>
      <!-- 强度指示 -->
      <div v-if="password" class="mt-4 flex items-center gap-3">
        <div class="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div class="h-full rounded-full transition-all" :class="strengthMeta.bar" />
        </div>
        <span class="text-sm shrink-0" :class="strengthMeta.text">{{ strengthMeta.label }}</span>
      </div>
    </div>

    <!-- 选项区 -->
    <div class="space-y-4">
      <div>
        <label class="flex justify-between text-sm mb-1">
          <span>密码长度</span>
          <span class="font-mono text-neutral-500 dark:text-neutral-400">{{ options.length }}</span>
        </label>
        <input
          v-model.number="options.length"
          type="range"
          min="4"
          max="64"
          class="w-full accent-sky-600"
          @input="refresh"
        />
      </div>
      <div class="grid gap-2 sm:grid-cols-2">
        <label
          v-for="item in labels"
          :key="item.key"
          class="flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <input
            v-model="options[item.key]"
            type="checkbox"
            class="accent-sky-600"
            :disabled="item.key !== 'excludeAmbiguous' && noCharset && !options[item.key]"
            @change="refresh"
          />
          {{ item.label }}
        </label>
      </div>
      <p v-if="noCharset" class="text-sm text-red-500">请至少选择一种字符类型。</p>
    </div>
  </div>
</template>
