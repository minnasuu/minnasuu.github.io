import { resumeData as defaultResumeData, type ResumeData } from "../data";
import {
  fetchResume,
  saveResumeToBackend,
  resetResumeOnBackend,
} from "../../../shared/utils/backendClient";

const STORAGE_KEY = "resume_data_v1";

// ============ 本地缓存（离线兜底） ============

const readLocal = (): ResumeData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeData;
    if (!parsed || !parsed.basic) return null;
    return parsed;
  } catch (e) {
    console.warn("[resume] read local cache failed", e);
    return null;
  }
};

const writeLocal = (data: ResumeData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // 一般是配额超限（base64 头像大）；不影响主流程
    console.warn("[resume] write local cache failed", e);
  }
};

const clearLocal = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
};

// ============ 同步获取（首次渲染用） ============

/** 同步获取兜底数据：优先本地缓存，否则默认数据。后端数据由 loadResumeAsync 异步覆盖 */
export const loadResumeSync = (): ResumeData => {
  return readLocal() ?? defaultResumeData;
};

// ============ 异步：与后端同步 ============

/** 从后端拉取最新简历；失败时返回本地缓存或默认数据 */
export const loadResumeAsync = async (): Promise<{
  data: ResumeData;
  source: "backend" | "local" | "default";
}> => {
  try {
    const remote = await fetchResume();
    if (remote && remote.basic) {
      const data: ResumeData = {
        basic: remote.basic,
        selfEvaluation: remote.selfEvaluation,
        education: remote.education,
        works: remote.works,
        projects: remote.projects,
        skills: remote.skills,
      } as ResumeData;
      // 同步一份到本地，离线时可用
      writeLocal(data);
      return { data, source: "backend" };
    }
  } catch (e) {
    console.warn("[resume] fetch from backend failed, fallback to local", e);
  }

  const local = readLocal();
  if (local) return { data: local, source: "local" };
  return { data: defaultResumeData, source: "default" };
};

/** 保存到后端；同时写入本地缓存。后端失败抛出错误供 UI 提示 */
export const saveResumeAsync = async (data: ResumeData): Promise<void> => {
  await saveResumeToBackend({
    basic: data.basic,
    selfEvaluation: data.selfEvaluation,
    education: data.education,
    works: data.works,
    projects: data.projects,
    skills: data.skills,
  });
  writeLocal(data);
};

/** 重置：删除后端记录 + 清除本地缓存 */
export const resetResumeAsync = async (): Promise<void> => {
  try {
    await resetResumeOnBackend();
  } catch (e) {
    // 后端不通时也允许清本地
    console.warn("[resume] reset on backend failed", e);
  }
  clearLocal();
};
