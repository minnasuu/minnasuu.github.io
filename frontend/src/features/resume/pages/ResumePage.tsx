import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeData } from "../data";
import {
  loadResumeSync,
  loadResumeAsync,
  saveResumeAsync,
  resetResumeAsync,
} from "../utils/storage";
import Editable from "../components/Editable";
import "../styles/ResumePage.scss";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const ResumePage: React.FC = () => {
  // 首次先用本地兜底数据渲染，避免白屏；随后异步覆盖为后端数据
  const [data, setData] = useState<ResumeData>(() => loadResumeSync());
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1800);
  }, []);

  // 通用 setter
  const update = useCallback((updater: (draft: ResumeData) => ResumeData) => {
    setData((prev) => updater(structuredClone(prev)));
    setDirty(true);
  }, []);

  // 操作
  const handleToggleEdit = () => {
    setEditing((v) => !v);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveResumeAsync(data);
      setDirty(false);
      setEditing(false);
      showToast("已保存到云端");
    } catch (e) {
      console.error(e);
      showToast("保存失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm("确定要重置为默认简历内容吗？将清除云端与本地的修改。")
    )
      return;
    try {
      await resetResumeAsync();
      const { data: fresh } = await loadResumeAsync();
      setData(fresh);
      setDirty(false);
      showToast("已重置");
    } catch (e) {
      console.error(e);
      showToast("重置失败");
    }
  };

  const handleDownloadPDF = () => {
    // 退出编辑模式以避免编辑边框出现在 PDF 中
    setEditing(false);
    // 等一帧让 DOM 渲染稳定
    window.setTimeout(() => {
      window.print();
    }, 50);
  };

  // 头像：触发文件选择
  const handleAvatarClick = () => {
    if (!editing) return;
    avatarInputRef.current?.click();
  };

  // 头像：选完文件 → 转 base64 写入 state
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 重置 value，方便下次选同一张图也能触发 onChange
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("请选择图片文件");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      showToast("图片不能超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        update((d) => {
          d.basic.avatar = result;
          return d;
        });
      }
    };
    reader.onerror = () => showToast("读取图片失败");
    reader.readAsDataURL(file);
  };

  // 头像：移除
  const handleAvatarRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    update((d) => {
      d.basic.avatar = undefined;
      return d;
    });
  };

  // 离开页面前提醒未保存
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      // 标准做法：preventDefault 即可触发提示（部分浏览器仍依赖 returnValue）
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // 挂载时从后端拉取最新数据
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: remote, source } = await loadResumeAsync();
        if (cancelled) return;
        setData(remote);
        if (source === "local") {
          showToast("使用本地缓存（后端不可达）");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const { basic, selfEvaluation, education, works, projects, skills } = data;

  return (
    <div className={`resume-page ${editing ? "is-editing" : ""}`}>
      {/* 顶部操作栏（打印时隐藏） */}
      <div className="resume-toolbar">
        <div className="resume-toolbar__inner">
          <span className="resume-toolbar__title">
            简历
            {loading && <em className="resume-toolbar__dirty">（加载中…）</em>}
            {!loading && dirty && (
              <em className="resume-toolbar__dirty">（未保存）</em>
            )}
          </span>
          <div className="resume-toolbar__actions">
            {editing && (
              <button
                type="button"
                className="resume-btn resume-btn--ghost"
                onClick={handleReset}
              >
                重置
              </button>
            )}
            <button
              type="button"
              className="resume-btn resume-btn--ghost"
              onClick={handleToggleEdit}
            >
              {editing ? "退出编辑" : "编辑"}
            </button>
            <button
              type="button"
              className="resume-btn resume-btn--primary"
              onClick={handleSave}
              disabled={saving || (!dirty && !editing)}
            >
              {saving ? "保存中…" : "保存"}
            </button>
            <button
              type="button"
              className="resume-btn resume-btn--accent"
              onClick={handleDownloadPDF}
            >
              下载 PDF
            </button>
          </div>
        </div>
      </div>

      <div className="resume-paper">
        {/* 顶部基础信息 */}
        <header className="resume-header">
          <div className="resume-header__main">
            <Editable
              as="h1"
              className="resume-header__name"
              editing={editing}
              value={basic.name}
              onChange={(v) =>
                update((d) => {
                  d.basic.name = v;
                  return d;
                })
              }
            />
            <div className="resume-header__meta">
              {basic.meta.map((item, index) => (
                <React.Fragment key={index}>
                  <Editable
                    as="span"
                    editing={editing}
                    value={item}
                    onChange={(v) =>
                      update((d) => {
                        d.basic.meta[index] = v;
                        return d;
                      })
                    }
                  />
                  {index < basic.meta.length - 1 && (
                    <span className="resume-header__divider">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Editable
              as="div"
              className="resume-header__position"
              editing={editing}
              value={basic.position}
              onChange={(v) =>
                update((d) => {
                  d.basic.position = v;
                  return d;
                })
              }
            />
            <Editable
              as="div"
              className="resume-header__status"
              editing={editing}
              value={basic.status}
              onChange={(v) =>
                update((d) => {
                  d.basic.status = v;
                  return d;
                })
              }
            />
          </div>
          <div
            className={`resume-header__avatar ${
              editing ? "is-editable" : ""
            } ${basic.avatar ? "has-image" : ""}`}
            onClick={handleAvatarClick}
            role={editing ? "button" : undefined}
            tabIndex={editing ? 0 : -1}
            onKeyDown={(e) => {
              if (editing && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleAvatarClick();
              }
            }}
            title={editing ? "点击更换头像" : undefined}
          >
            {basic.avatar ? (
              <img
                src={basic.avatar}
                alt="头像"
                className="resume-header__avatar-img"
              />
            ) : (
              <div className="resume-header__avatar-placeholder" />
            )}

            {editing && (
              <>
                <div className="resume-header__avatar-mask">
                  <span>{basic.avatar ? "更换头像" : "上传头像"}</span>
                </div>
                {basic.avatar && (
                  <button
                    type="button"
                    className="resume-header__avatar-remove"
                    onClick={handleAvatarRemove}
                    aria-label="删除头像"
                  >
                    ×
                  </button>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="resume-header__avatar-input"
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>
        </header>

        {/* 自我评价 */}
        <SectionTitle>自我评价</SectionTitle>
        <ul className="resume-bullet-list">
          {selfEvaluation.bullets.map((b, i) => (
            <li key={i}>
              <Editable
                as="strong"
                editing={editing}
                value={b.label}
                onChange={(v) =>
                  update((d) => {
                    d.selfEvaluation.bullets[i].label = v;
                    return d;
                  })
                }
              />
              <span>：</span>
              <Editable
                as="span"
                editing={editing}
                multiline
                value={b.content}
                onChange={(v) =>
                  update((d) => {
                    d.selfEvaluation.bullets[i].content = v;
                    return d;
                  })
                }
              />
            </li>
          ))}
        </ul>

        {/* 教育背景 */}
        <SectionTitle>教育背景</SectionTitle>
        {education.map((edu, i) => (
          <div className="resume-row" key={i}>
            <Editable
              as="span"
              className="resume-row__period"
              editing={editing}
              value={edu.period}
              onChange={(v) =>
                update((d) => {
                  d.education[i].period = v;
                  return d;
                })
              }
            />
            <Editable
              as="span"
              className="resume-row__main"
              editing={editing}
              value={edu.school}
              onChange={(v) =>
                update((d) => {
                  d.education[i].school = v;
                  return d;
                })
              }
            />
            <Editable
              as="span"
              className="resume-row__sub"
              editing={editing}
              value={edu.degree}
              onChange={(v) =>
                update((d) => {
                  d.education[i].degree = v;
                  return d;
                })
              }
            />
            <Editable
              as="span"
              className="resume-row__sub"
              editing={editing}
              value={edu.major}
              onChange={(v) =>
                update((d) => {
                  d.education[i].major = v;
                  return d;
                })
              }
            />
          </div>
        ))}

        {/* 工作经历 */}
        <SectionTitle>工作经历</SectionTitle>
        {works.map((work, wi) => (
          <div className="resume-block" key={wi}>
            <div className="resume-row resume-row--bold">
              <Editable
                as="span"
                className="resume-row__period"
                editing={editing}
                value={work.period}
                onChange={(v) =>
                  update((d) => {
                    d.works[wi].period = v;
                    return d;
                  })
                }
              />
              <Editable
                as="span"
                className="resume-row__main"
                editing={editing}
                value={work.company}
                onChange={(v) =>
                  update((d) => {
                    d.works[wi].company = v;
                    return d;
                  })
                }
              />
              <Editable
                as="span"
                className="resume-row__right"
                editing={editing}
                value={work.title}
                onChange={(v) =>
                  update((d) => {
                    d.works[wi].title = v;
                    return d;
                  })
                }
              />
            </div>
            <div className="resume-block__subtitle">职责业绩：</div>
            <ul className="resume-bullet-list">
              {work.duties.map((duty, di) => (
                <li key={di}>
                  <Editable
                    as="strong"
                    editing={editing}
                    value={duty.label}
                    onChange={(v) =>
                      update((d) => {
                        d.works[wi].duties[di].label = v;
                        return d;
                      })
                    }
                  />
                  {duty.label && <span>：</span>}
                  <Editable
                    as="span"
                    editing={editing}
                    multiline
                    value={duty.content}
                    onChange={(v) =>
                      update((d) => {
                        d.works[wi].duties[di].content = v;
                        return d;
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 项目经历 */}
        <SectionTitle>项目经历</SectionTitle>
        {projects.map((proj, pi) => (
          <div className="resume-block" key={pi}>
            <div className="resume-row resume-row--bold">
              <Editable
                as="span"
                className="resume-row__period"
                editing={editing}
                value={proj.period}
                onChange={(v) =>
                  update((d) => {
                    d.projects[pi].period = v;
                    return d;
                  })
                }
              />
              <Editable
                as="span"
                className="resume-row__main"
                editing={editing}
                value={proj.name}
                onChange={(v) =>
                  update((d) => {
                    d.projects[pi].name = v;
                    return d;
                  })
                }
              />
              <Editable
                as="span"
                className="resume-row__right"
                editing={editing}
                value={proj.role}
                onChange={(v) =>
                  update((d) => {
                    d.projects[pi].role = v;
                    return d;
                  })
                }
              />
            </div>
            {proj.background !== undefined && (
              <p className="resume-block__paragraph">
                <strong>项目背景：</strong>
                <Editable
                  as="span"
                  editing={editing}
                  multiline
                  value={proj.background}
                  onChange={(v) =>
                    update((d) => {
                      d.projects[pi].background = v;
                      return d;
                    })
                  }
                />
              </p>
            )}
            {proj.duties && proj.duties.length > 0 && (
              <>
                <div className="resume-block__subtitle">项目职责：</div>
                <ul className="resume-bullet-list">
                  {proj.duties.map((duty, di) => (
                    <li key={di}>
                      <Editable
                        as="strong"
                        editing={editing}
                        value={duty.label}
                        onChange={(v) =>
                          update((d) => {
                            d.projects[pi].duties![di].label = v;
                            return d;
                          })
                        }
                      />
                      {duty.label && <span>：</span>}
                      <Editable
                        as="span"
                        editing={editing}
                        multiline
                        value={duty.content}
                        onChange={(v) =>
                          update((d) => {
                            d.projects[pi].duties![di].content = v;
                            return d;
                          })
                        }
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {proj.achievement !== undefined && (
              <p className="resume-block__paragraph">
                <strong>项目业绩：</strong>
                <Editable
                  as="span"
                  editing={editing}
                  multiline
                  value={proj.achievement}
                  onChange={(v) =>
                    update((d) => {
                      d.projects[pi].achievement = v;
                      return d;
                    })
                  }
                />
              </p>
            )}
          </div>
        ))}

        {/* 专业技能 */}
        <SectionTitle>专业技能</SectionTitle>
        <div className="resume-skills">
          {skills.map((skill, i) => (
            <React.Fragment key={i}>
              <Editable
                as="span"
                editing={editing}
                value={skill}
                onChange={(v) =>
                  update((d) => {
                    d.skills[i] = v;
                    return d;
                  })
                }
              />
              {i < skills.length - 1 && (
                <span className="resume-skills__dot">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {toast && <div className="resume-toast">{toast}</div>}
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="resume-section-title">{children}</h2>
);

export default ResumePage;
