import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './terminalTheme.scss';
import type { PersonalData, Article } from '../../../shared/types';
import LanguageSwitcher from "../../../shared/components/LanguageSwitcher";
import ThemeSwitcher from "../../../shared/components/ThemeSwitcher";
import Sidebar from "../../../shared/components/themes/Sidebar";
import type { SidebarThemeConfig } from "../../../shared/components/themes/Sidebar";
import { fetchArticles } from '../../../shared/utils/backendClient';

interface TerminalThemeProps {
  data: PersonalData;
}

const TerminalTheme: React.FC<TerminalThemeProps> = ({ data }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<
    Array<{ type: string; content: string; link?: string }>
  >([]);
  const [isTyping, setIsTyping] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  const sidebarConfig: SidebarThemeConfig = {
    themePrefix: 'terminal',
    linkColor: '#87ceeb',
  };

  // 加载文章数据
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      }
    };

    loadArticles();
  }, []);

  const terminalLines = [
    { type: "command", content: "whoami" },
    { type: "output", content: data.info.name },
    { type: "command", content: "echo $enterprise" },
    { type: "output", content: data.info.title },
    { type: "command", content: "cat about.txt" },
    { type: "output", content: data.info.bio },
    { type: "command", content: "ls skills/" },
    ...data.skills.map((skill) => ({
      type: "skill-item",
      content: `${skill.name} - ${skill.level}%`,
    })),
    { type: "command", content: "ls interests/" },
    {
      type: "output",
      content: data.interests.map((interest) => interest.name).join("、"),
    },
    { type: "command", content: "cat articles/*.md | head -5" },
    ...articles.slice(0, 5).map((article) => ({
      type: "article-list",
      content: `${article.title} (${article.readTime}min)`,
    })),
    ...(articles.length > 5
      ? [
          {
            type: "view-more",
            content: `... and ${articles.length - 5} more articles`,
            link: "#articles",
          },
        ]
      : []),
    { type: "command", content: 'find projects/ -name "*.featured"' },
    ...data.projects
      .filter((p) => p.featured)
      .slice(0, 5)
      .map((project) => ({
        type: "project-list",
        content: `${project.name} - ${project.description}`,
      })),
    ...(data.projects.filter((p) => p.featured).length > 5
      ? [
          {
            type: "view-more",
            content: `... and ${
              data.projects.filter((p) => p.featured).length - 5
            } more projects`,
            link: "#projects",
          },
        ]
      : []),
    { type: "command", content: 'find crafts/ -name "*.featured"' },
    ...data.crafts
      .filter((c) => c.featured)
      .slice(0, 5)
      .map((craft) => ({
        type: "craft-list",
        content: `${craft.name} - ${craft.description}`,
      })),
    ...(data.crafts.filter((c) => c.featured).length > 5
      ? [
          {
            type: "view-more",
            content: `... and ${
              data.crafts.filter((c) => c.featured).length - 5
            } more crafts`,
            link: "#crafts",
          },
        ]
      : []),
    { type: "command", content: 'echo "Ready for next command..."' },
    { type: "info-message", content: "Ready for next command..." },
    { type: "command", content: "_" },
  ];

  // 当data或articles改变时，重置状态
  useEffect(() => {
    setCurrentLine(0);
    setDisplayedLines([]);
    setIsTyping(true);
  }, [data, articles]);

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, terminalLines[currentLine]]);
        setCurrentLine((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentLine, terminalLines]);

  return (
    <div className="terminal-theme theme-terminal">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn close"></span>
          <span className="terminal-btn minimize"></span>
          <span className="terminal-btn maximize"></span>
        </div>
        <div className="terminal-title">minna@portfolio:~</div>
        <div className="terminal-controls">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      <div className="terminal-body">
        <div className="terminal-content">
          <div className="terminal-text">
            {displayedLines.map((line, index) => (
              <div key={index} className={`terminal-line ${line.type}`}>
                {line.type === "command" && (
                  <span className="command-prompt">minna@portfolio:~$ </span>
                )}
                {line.type === "view-more" ? (
                  <Link
                    to={
                      line.link === "#articles"
                        ? "/articles"
                        : line.link === "#projects"
                        ? "/projects"
                        : line.link === "#crafts"
                        ? "/crafts"
                        : "/"
                    }
                    className="view-more-link"
                  >
                    {line.content}
                  </Link>
                ) : (
                  line.content
                )}
              </div>
            ))}
            {isTyping && <span className="cursor">█</span>}
          </div>
        </div>

        <Sidebar themeConfig={sidebarConfig} />
      </div>
    </div>
  );
};

export default TerminalTheme;
