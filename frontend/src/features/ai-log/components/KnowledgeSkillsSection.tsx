import React from 'react';
import type { KnowledgeSkill } from '../../../shared/types';

interface SkillsGrowth {
  newSkills: string[];
  improvedSkills: string[];
  totalSkillsCount: number;
  averageSkillLevel: number;
}

interface KnowledgeSkillsSectionProps {
  skills: KnowledgeSkill[];
  growth: SkillsGrowth;
  language: 'zh' | 'en';
  theme: string;
}

const KnowledgeSkillsSection: React.FC<KnowledgeSkillsSectionProps> = ({
  skills,
  growth,
  language
}) => {
  const texts = {
    zh: {
      title: '知识技能总结',
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
      lastUpdated: '最后更新'
    },
    en: {
      title: 'Knowledge & Skills Summary',
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
      lastUpdated: 'Last Updated'
    }
  };

  const t = texts[language];

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

      {/* 详细技能列表 */}
      <div className="skills-list">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-card">
            <div className="skill-header">
              <h4 className="skill-name">{skill.name}</h4>
              <span className={`skill-category ${skill.category}`}>
                {getCategoryLabel(skill.category)}
              </span>
            </div>
            
            <p className="skill-description">{skill.description}</p>
            
            <div className="skill-level">
              <div className="level-bar">
                <div 
                  className={`level-fill ${getSkillLevelColor(skill.level)}`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span className="level-text">{skill.level}%</span>
            </div>
            
            <div className="skill-meta">
              <span className="last-updated">
                {t.lastUpdated}: {skill.lastUpdated}
              </span>
              {skill.relatedLinks && skill.relatedLinks.length > 0 && (
                <div className="related-links">
                  {skill.relatedLinks.map((link, index) => (
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
        ))}
      </div>
    </section>
  );
};

export default KnowledgeSkillsSection;