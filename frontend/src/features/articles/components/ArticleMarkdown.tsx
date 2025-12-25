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
    // 配置marked选项
    marked.setOptions({
        gfm: true, // 支持GitHub风格的markdown
        breaks: true // 支持换行符转换为<br>
    });

    // 解析markdown内容，分离代码块和普通内容
    const parseMarkdownWithCodeBlocks = (content: string) => {
        const parts: React.ReactNode[] = [];
        let currentIndex = 0;
        
        // 匹配代码块的正则表达式
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let partIndex = 0;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            // 添加代码块前的markdown内容
            if (match.index > currentIndex) {
                const markdownPart = content.slice(currentIndex, match.index);
                if (markdownPart.trim()) {
                    const htmlContent = marked.parse(markdownPart);
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
        if (currentIndex < content.length) {
            const remainingContent = content.slice(currentIndex);
            if (remainingContent.trim()) {
                const htmlContent = marked.parse(remainingContent);
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