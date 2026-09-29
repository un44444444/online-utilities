/**
 * 密码生成核心逻辑 —— 纯 TypeScript，零框架依赖。
 * 可单元测试，可跨框架（Vue/React/…）复用。
 */

export interface PasswordOptions {
  /** 长度 4–64 */
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  /** 排除易混淆字符（l 1 I O 0） */
  excludeAmbiguous: boolean;
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/~';
const AMBIGUOUS = new Set(['l', '1', 'I', 'O', '0']);

function buildPool(options: PasswordOptions): string {
  let pool = '';
  const push = (chars: string) => {
    if (options.excludeAmbiguous) chars = [...chars].filter((c) => !AMBIGUOUS.has(c)).join('');
    pool += chars;
  };
  if (options.lowercase) push(LOWER);
  if (options.uppercase) push(UPPER);
  if (options.numbers) push(NUMBERS);
  if (options.symbols) push(SYMBOLS);
  return pool;
}

/** 使用 crypto.getRandomValues 做无偏采样：rejection sampling */
function secureRandomInt(maxExclusive: number): number {
  const range = 256 - (256 % maxExclusive);
  const buf = new Uint8Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= range);
  return value % maxExclusive;
}

export function generatePassword(options: PasswordOptions): string {
  const pool = buildPool(options);
  if (!pool) return '';
  let out = '';
  for (let i = 0; i < options.length; i++) {
    out += pool[secureRandomInt(pool.length)];
  }
  return out;
}

export type Strength = 'weak' | 'medium' | 'strong';

/** 用字符集大小的对数估算熵（bits），评估强度 */
export function estimateStrength(password: string, poolSize: number): Strength {
  if (!password || !poolSize) return 'weak';
  const entropy = password.length * Math.log2(poolSize);
  if (entropy < 45) return 'weak';
  if (entropy < 80) return 'medium';
  return 'strong';
}

export function poolSizeOf(options: PasswordOptions): number {
  return buildPool(options).length;
}
