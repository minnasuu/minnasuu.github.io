import React from 'react'
import { marked } from 'marked'
import ArticleCode from './ArticleCode'
import '../styles/shared-markdown.css'

type Props = {
    children: string;
    className?: string;
}

const ArticleMarkdown: React.FC<Props> = ({
    children,
    className = ''
}) => {
    // 配置自定义 renderer
    const renderer = new marked.Renderer();
    const headingCounts: Record<string, number> = {};

    // 生成标题的唯一 id
    const generateHeadingId = (text: string): string => {
        // 移除标点符号，转换为小写，空格替换为连字符
        const cleanText = text
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 保留字母、数字、中文
            .trim()
            .replace(/\s+/g, '-');
        
        // 如果已存在相同的文本，添加数字后缀
        if (headingCounts[cleanText]) {
            headingCounts[cleanText]++;
            return `${cleanText}-${headingCounts[cleanText]}`;
        } else {
            headingCounts[cleanText] = 1;
            return cleanText;
        }
    };

    // 自定义标题渲染
    renderer.heading = ({ text, depth }) => {
        if (depth === 1 || depth === 2) {
            const id = generateHeadingId(text);
            return `<h${depth} id="${id}">${text}</h${depth}>`;
        }
        return `<h${depth}>${text}</h${depth}>`;
    };

    // 配置marked选项
    marked.setOptions({
        gfm: true,      // 支持GitHub风格的markdown
        breaks: true,   // 支持换行符转换为<br>
        renderer: renderer
    });

    // 预处理 Markdown 文本，修复中文标点导致的加粗/斜体解析问题
    const preprocessMarkdown = (content: string): string => {
        return content
            // 将 **xxx：** 转换为 **xxx**： （标点移到外面）
            .replace(/\*\*([^*\n]+?)([：。，！？；）】」』、])\*\*/g, '**$1**$2')
            // 修复 __xxx：__ -> __xxx__：
            .replace(/__([^_\n]+?)([：。，！？；）】」』、])__/g, '__$1__$2')
            // 修复单个 * 的情况
            .replace(/\*([^*\n]+?)([：。，！？；）】」』、])\*/g, '*$1*$2')
            // 修复单个 _ 的情况
            .replace(/_([^_\n]+?)([：。，！？；）】」』、])_/g, '_$1_$2');
    };

    // 解析markdown内容，分离代码块和普通内容
    const parseMarkdownWithCodeBlocks = (content: string) => {
        const parts: React.ReactNode[] = [];
        let currentIndex = 0;
        
        // 匹配代码块的正则表达式
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let partIndex = 0;

        // 先预处理整个内容
        const preprocessedContent = preprocessMarkdown(content);

        while ((match = codeBlockRegex.exec(preprocessedContent)) !== null) {
            // 添加代码块前的markdown内容
            if (match.index > currentIndex) {
                const markdownPart = preprocessedContent.slice(currentIndex, match.index);
                if (markdownPart.trim()) {
                    // marked() 直接调用（同步方式）
                    const htmlContent = marked(markdownPart) as string;
                    parts.push(
                        <div 
                            key={`markdown-${partIndex}`}
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    );
                    partIndex++;
                }
            }

            // 添加代码块
            const language = match[1] || 'text';
            const code = match[2].trim();
            parts.push(
                <ArticleCode 
                    key={`code-${partIndex}`}
                    language={language}
                    codeStr={code}
                />
            );
            partIndex++;

            currentIndex = match.index + match[0].length;
        }

        // 添加最后剩余的markdown内容
        if (currentIndex < preprocessedContent.length) {
            const remainingContent = preprocessedContent.slice(currentIndex);
            if (remainingContent.trim()) {
                // marked() 直接调用（同步方式）
                const htmlContent = marked(remainingContent) as string;
                parts.push(
                    <div 
                        key={`markdown-${partIndex}`}
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                );
            }
        }

        return parts;
    };

    const parsedContent = parseMarkdownWithCodeBlocks(children);

    return (
        <div className={`markdown-content ${className}`}>
            {parsedContent}
        </div>
    )
}

export default ArticleMarkdown;