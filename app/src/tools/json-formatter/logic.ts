/**
 * JSON 格式化核心逻辑 —— 纯 TypeScript，零框架依赖。
 */

export interface JsonError {
  message: string;
  /** 1 起始的行号；无法定位时为 undefined */
  line?: number;
}

export type JsonResult =
  | { ok: true; output: string }
  | { ok: false; error: JsonError };

function positionToLine(input: string, position: number): number {
  let line = 1;
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === '\n') line++;
  }
  return line;
}

/** 从引擎报错信息中提取 position（V8/JSC 常见格式） */
function extractPosition(message: string): number | undefined {
  const m = /position (\d+)/.exec(message);
  return m ? Number(m[1]) : undefined;
}

function toError(input: string, e: unknown): JsonError {
  const raw = e instanceof Error ? e.message : String(e);
  const pos = extractPosition(raw);
  return {
    message: raw,
    line: pos !== undefined ? positionToLine(input, pos) : undefined,
  };
}

export function formatJSON(input: string, indent: number = 2): JsonResult {
  try {
    const parsed: unknown = JSON.parse(input);
    return { ok: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { ok: false, error: toError(input, e) };
  }
}

export function minifyJSON(input: string): JsonResult {
  try {
    const parsed: unknown = JSON.parse(input);
    return { ok: true, output: JSON.stringify(parsed) };
  } catch (e) {
    return { ok: false, error: toError(input, e) };
  }
}
