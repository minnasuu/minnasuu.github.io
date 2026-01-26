import React from 'react';
import type { KnowledgeSkill } from '../../../shared/types';

interface SkillsGrowth {
  newSkills: string[];
  improvedSkills: string[];
  totalSkillsCount: number;
  averageSkillLevel: number;
}

interface IndustryStandard {
  id: string;
  name: string;
  category: string;
  levels: {
    junior: { level: number; description: string; requirements: string[] };
    mid: { level: number; description: string; requirements: string[] };
    senior: { level: number; description: string; requirements: string[] };
    expert: { level: number; description: string; requirements: string[] };
  };
}

interface KnowledgeSkillsSectionProps {
  skills: KnowledgeSkill[];
  growth: SkillsGrowth;
  language: 'zh' | 'en';
  theme: string;
  goalTitle?: string; // 添加目标标题，用于生成对应的技能对比
}

const KnowledgeSkillsSection: React.FC<KnowledgeSkillsSectionProps> = ({
  skills,
  growth,
  language,
  goalTitle
}) => {
  const texts = {
    zh: {
      title: '知识技能对比分析',
      industryStandard: '行业标准',
      currentLevel: '当前水平',
      skillLevel: '掌握程度',
      category: '分类',
      newSkills: '新掌握技能',
      improvedSkills: '提升技能',
      totalSkills: '总技能数',
      averageLevel: '平均水平',
      technical: '技术',
      soft: '软技能',
      domain: '领域知识',
      tool: '工具',
      lastUpdated: '最后更新',
      junior: '初级',
      mid: '中级',
      senior: '高级',
      expert: '专家',
      requirements: '要求',
      gap: '差距分析',
      nextLevel: '下一级别'
    },
    en: {
      title: 'Knowledge & Skills Comparison',
      industryStandard: 'Industry Standard',
      currentLevel: 'Current Level',
      skillLevel: 'Proficiency',
      category: 'Category',
      newSkills: 'New Skills',
      improvedSkills: 'Improved Skills',
      totalSkills: 'Total Skills',
      averageLevel: 'Average Level',
      technical: 'Technical',
      soft: 'Soft Skills',
      domain: 'Domain Knowledge',
      tool: 'Tools',
      lastUpdated: 'Last Updated',
      junior: 'Junior',
      mid: 'Mid-level',
      senior: 'Senior',
      expert: 'Expert',
      requirements: 'Requirements',
      gap: 'Gap Analysis',
      nextLevel: 'Next Level'
    }
  };

  const t = texts[language];

  // 根据目标标题生成对应的技能数据
  const generateSkillFromGoal = (goalTitle: string): KnowledgeSkill => {
    // 根据目标标题关键词匹配技能类型
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('react') || lowerTitle.includes('前端') || lowerTitle.includes('组件')) {
      return {
        id: 'react-advanced',
        name: 'React高级特性',
        category: 'technical',
        level: 85, // 基于目标设定当前水平
        description: '深入理解React Hooks、Context、性能优化等高级特性，能够独立开发复杂的React应用',
        lastUpdated: new Date().toISOString().split('T')[0],
        relatedLinks: ['https://react.dev/learn']
      };
    } else if (lowerTitle.includes('typescript') || lowerTitle.includes('类型')) {
      return {
        id: 'typescript',
        name: 'TypeScript',
        category: 'technical',
        level: 78,
        description: '掌握TypeScript类型系统、泛型、高级类型等核心概念，能够构建类型安全的应用',
        lastUpdated: new Date().toISOString().split('T')[0],
        relatedLinks: ['https://www.typescriptlang.org/docs/']
      };
    } else if (lowerTitle.includes('node') || lowerTitle.includes('后端') || lowerTitle.includes('服务器')) {
      return {
        id: 'nodejs',
        name: 'Node.js后端开发',
        category: 'technical',
        level: 72,
        description: '熟练使用Node.js进行后端开发，掌握Express、数据库操作、API设计等技能',
        lastUpdated: new Date().toISOString().split('T')[0],
        relatedLinks: ['https://nodejs.org/docs/']
      };
    } else if (lowerTitle.includes('python') || lowerTitle.includes('数据') || lowerTitle.includes('机器学习')) {
      return {
        id: 'python-data',
        name: 'Python数据分析',
        category: 'technical',
        level: 68,
        description: '使用Python进行数据分析和处理，掌握pandas、numpy、matplotlib等核心库',
        lastUpdated: new Date().toISOString().split('T')[0],
        relatedLinks: ['https://docs.python.org/']
      };
    } else {
      // 默认通用技能
      return {
        id: 'general-programming',
        name: '编程技能提升',
        category: 'technical',
        level: 75,
        description: '提升编程思维和代码质量，掌握算法、设计模式、代码重构等核心技能',
        lastUpdated: new Date().toISOString().split('T')[0],
        relatedLinks: []
      };
    }
  };

  // 扩展行业标准数据
  const getIndustryStandards = (): IndustryStandard[] => [
    {
      id: 'react-advanced',
      name: 'React高级特性',
      category: 'technical',
      levels: {
        junior: {
          level: 30,
          description: '基础组件开发',
          requirements: ['理解JSX语法', '掌握基本Hooks', '能写简单组件']
        },
        mid: {
          level: 60,
          description: '中级应用开发',
          requirements: ['熟练使用Hooks', '理解状态管理', '掌握组件优化']
        },
        senior: {
          level: 85,
          description: '高级架构设计',
          requirements: ['自定义Hooks', '性能优化', '架构设计', '团队协作']
        },
        expert: {
          level: 95,
          description: '技术专家',
          requirements: ['框架贡献', '技术分享', '团队培训', '创新实践']
        }
      }
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'technical',
      levels: {
        junior: {
          level: 25,
          description: '基础类型使用',
          requirements: ['基本类型定义', '接口使用', '简单泛型']
        },
        mid: {
          level: 55,
          description: '中级类型系统',
          requirements: ['复杂泛型', '工具类型', '类型推导', '模块声明']
        },
        senior: {
          level: 80,
          description: '高级类型编程',
          requirements: ['条件类型', '映射类型', '模板字面量', '类型体操']
        },
        expert: {
          level: 95,
          description: '类型系统专家',
          requirements: ['编译器理解', '类型系统设计', '工具开发']
        }
      }
    },
    {
      id: 'nodejs',
      name: 'Node.js后端开发',
      category: 'technical',
      levels: {
        junior: {
          level: 30,
          description: '基础后端开发',
          requirements: ['理解HTTP协议', '掌握Express基础', '简单API开发']
        },
        mid: {
          level: 60,
          description: '中级后端架构',
          requirements: ['数据库设计', '中间件开发', '错误处理', 'RESTful API']
        },
        senior: {
          level: 85,
          description: '高级系统设计',
          requirements: ['微服务架构', '性能优化', '安全防护', '监控部署']
        },
        expert: {
          level: 95,
          description: '后端架构专家',
          requirements: ['分布式系统', '高并发处理', '技术选型', '团队领导']
        }
      }
    },
    {
      id: 'python-data',
      name: 'Python数据分析',
      category: 'technical',
      levels: {
        junior: {
          level: 25,
          description: '基础数据处理',
          requirements: ['Python语法', 'pandas基础', '数据清洗']
        },
        mid: {
          level: 55,
          description: '中级数据分析',
          requirements: ['统计分析', '数据可视化', 'SQL查询', '机器学习入门']
        },
        senior: {
          level: 80,
          description: '高级数据科学',
          requirements: ['深度学习', '模型优化', '大数据处理', '业务洞察']
        },
        expert: {
          level: 95,
          description: '数据科学专家',
          requirements: ['算法创新', '系统架构', '团队管理', '产品落地']
        }
      }
    },
    {
      id: 'general-programming',
      name: '编程技能提升',
      category: 'technical',
      levels: {
        junior: {
          level: 30,
          description: '基础编程能力',
          requirements: ['语法熟练', '基本算法', '代码规范']
        },
        mid: {
          level: 60,
          description: '中级开发技能',
          requirements: ['设计模式', '代码重构', '测试驱动', '版本控制']
        },
        senior: {
          level: 85,
          description: '高级工程能力',
          requirements: ['架构设计', '性能优化', '代码审查', '技术决策']
        },
        expert: {
          level: 95,
          description: '技术专家',
          requirements: ['技术创新', '团队培养', '行业影响', '产品思维']
        }
      }
    }
  ];

  const industryStandards = getIndustryStandards();

  // 获取要显示的技能（只显示一个，基于目标生成）
  const targetSkill = goalTitle ? generateSkillFromGoal(goalTitle) : (skills.length > 0 ? skills[0] : null);

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      technical: t.technical,
      soft: t.soft,
      domain: t.domain,
      tool: t.tool
    };
    return categoryMap[category] || category;
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 80) return 'high';
    if (level >= 60) return 'medium';
    return 'low';
  };

  const getCurrentLevelName = (level: number) => {
    if (level >= 90) return t.expert;
    if (level >= 75) return t.senior;
    if (level >= 50) return t.mid;
    return t.junior;
  };

  const getNextLevelInfo = (currentLevel: number, standard: IndustryStandard) => {
    const levels = [
      { name: t.junior, ...standard.levels.junior },
      { name: t.mid, ...standard.levels.mid },
      { name: t.senior, ...standard.levels.senior },
      { name: t.expert, ...standard.levels.expert }
    ];

    for (const levelInfo of levels) {
      if (currentLevel < levelInfo.level) {
        return levelInfo;
      }
    }
    return null;
  };

  return (
    <section className="knowledge-skills-section">
      <h3 className="section-title">{t.title}</h3>
      
      {/* 技能增长概览 */}
      <div className="skills-overview">
        <div className="overview-stats">
          <div className="stat-item">
            <span className="stat-label">{t.totalSkills}</span>
            <span className="stat-value">{growth.totalSkillsCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t.averageLevel}</span>
            <span className="stat-value">{growth.averageSkillLevel}%</span>
          </div>
        </div>
        
        <div className="growth-highlights">
          {growth.newSkills.length > 0 && (
            <div className="growth-item new-skills">
              <h4>{t.newSkills}</h4>
              <ul>
                {growth.newSkills.map((skill, index) => (
                  <li key={index} className="skill-tag new">{skill}</li>
                ))}
              </ul>
            </div>
          )}
          
          {growth.improvedSkills.length > 0 && (
            <div className="growth-item improved-skills">
              <h4>{t.improvedSkills}</h4>
              <ul>
                {growth.improvedSkills.map((skill, index) => (
                  <li key={index} className="skill-tag improved">{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 技能对比分析 - 只显示一个与目标相关的技能 */}
      <div className="skills-comparison">
        {targetSkill ? (
          <div className="skill-comparison-card">
            <div className="skill-header">
              <h4 className="skill-name">{targetSkill.name}</h4>
              <span className={`skill-category ${targetSkill.category}`}>
                {getCategoryLabel(targetSkill.category)}
              </span>
            </div>

            <div className="comparison-content">
              {/* 左侧：行业标准 */}
              <div className="industry-standard">
                <h5 className="section-subtitle">{t.industryStandard}</h5>
                {(() => {
                  const standard = industryStandards.find(s => s.id === targetSkill.id);
                  return standard ? (
                    <div className="standard-levels">
                      {Object.entries(standard.levels).map(([levelKey, levelData]) => (
                        <div 
                          key={levelKey} 
                          className={`level-item ${targetSkill.level >= levelData.level ? 'achieved' : ''}`}
                        >
                          <div className="level-header">
                            <span className="level-name">
                              {levelKey === 'junior' ? t.junior : 
                               levelKey === 'mid' ? t.mid :
                               levelKey === 'senior' ? t.senior : t.expert}
                            </span>
                            <span className="level-threshold">{levelData.level}%</span>
                          </div>
                          <p className="level-description">{levelData.description}</p>
                          <ul className="level-requirements">
                            {levelData.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-standard">暂无行业标准数据</p>
                  );
                })()}
              </div>

              {/* 右侧：当前水平 */}
              <div className="current-level">
                <h5 className="section-subtitle">{t.currentLevel}</h5>
                <div className="current-status">
                  <div className="level-indicator">
                    <div className="level-circle">
                      <span className="level-percentage">{targetSkill.level}%</span>
                    </div>
                    <span className="level-name">{getCurrentLevelName(targetSkill.level)}</span>
                  </div>
                  
                  <div className="skill-progress">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${getSkillLevelColor(targetSkill.level)}`}
                        style={{ width: `${targetSkill.level}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="skill-description">{targetSkill.description}</p>

                  {(() => {
                    const standard = industryStandards.find(s => s.id === targetSkill.id);
                    const nextLevel = standard ? getNextLevelInfo(targetSkill.level, standard) : null;
                    
                    return nextLevel ? (
                      <div className="next-level-info">
                        <h6>{t.nextLevel}: {nextLevel.name}</h6>
                        <p className="gap-info">
                          还需提升 {nextLevel.level - targetSkill.level}% 达到下一级别
                        </p>
                        <ul className="next-requirements">
                          {nextLevel.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}

                  <div className="skill-meta">
                    <span className="last-updated">
                      {t.lastUpdated}: {targetSkill.lastUpdated}
                    </span>
                    {targetSkill.relatedLinks && targetSkill.relatedLinks.length > 0 && (
                      <div className="related-links">
                        {targetSkill.relatedLinks.map((link, index) => (
                          <a 
                            key={index} 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="skill-link"
                          >
                            📖
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-skill-data">
            <p>暂无技能对比数据</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default KnowledgeSkillsSection;