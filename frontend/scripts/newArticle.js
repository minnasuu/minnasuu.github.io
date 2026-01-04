#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');
const articlesDataPath = path.join(projectRoot, 'src/pages/articles/articlesData');
const personalDataPath = path.join(projectRoot, 'src/data/personalData.tsx');

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 提示用户输入
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 生成文章ID（基于标题转换）
function generateArticleId(title) {
  // 简单的中文转拼音映射（常用字符）
  const pinyinMap = {
    '测试': 'test',
    '文章': 'article',
    '标题': 'title',
    '深色': 'dark',
    '模式': 'mode',
    '实现': 'implementation',
    '动画': 'animation',
    '布局': 'layout',
    '组件': 'component',
    '开发': 'development',
    '技术': 'tech',
    '教程': 'tutorial',
    '指南': 'guide',
    '分享': 'share',
    '经验': 'experience'
  };
  
  let id = title.toLowerCase();
  
  // 替换常见中文词汇
  for (const [chinese, pinyin] of Object.entries(pinyinMap)) {
    id = id.replace(new RegExp(chinese, 'g'), pinyin);
  }
  
  // 移除剩余的中文字符和特殊字符，只保留英文、数字、空格、连字符
  id = id.replace(/[^\w\s-]/g, '');
  
  // 如果转换后为空，使用时间戳
  if (!id.trim()) {
    id = `article-${Date.now()}`;
  }
  
  return id
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符
}

// 格式化日期
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// 创建文章目录和文件
function createArticleFiles(articleData) {
  const { id, title } = articleData;
  const articleDir = path.join(articlesDataPath, id);
  
  // 创建目录
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }
  
  // 创建 data.md 文件
  const markdownContent = `这里是文章内容。请编辑此文件来添加你的文章内容。

## 章节示例

你可以在这里添加文章的各个章节。

### 子章节

支持多级标题。

## 代码示例

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

## 图片示例

![图片描述](图片链接)
`;
  
  fs.writeFileSync(path.join(articleDir, 'data.md'), markdownContent);
  
  // 创建 React 组件文件
  const componentName = id.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  const reactContent = `import ArticleLayout from "../../components/ArticleLayout.tsx";
import ArticleMarkdown from "../../components/ArticleMarkdown.tsx";
import ArticleEndText from "../../components/ArticleEndText.tsx";
import markdownContent from "./data.md?raw";

export const ${id.replace(/-/g, '_')} = (
  <ArticleLayout>
    <ArticleMarkdown>{markdownContent}</ArticleMarkdown>
    <ArticleEndText />
  </ArticleLayout>
);
`;
  
  fs.writeFileSync(path.join(articleDir, `${id.replace(/-/g, '_')}.tsx`), reactContent);
  
  console.log(`✅ 文章文件已创建：`);
  console.log(`   📁 目录：${articleDir}`);
  console.log(`   📄 Markdown：${path.join(articleDir, 'data.md')}`);
  console.log(`   ⚛️ React组件：${path.join(articleDir, `${id.replace(/-/g, '_')}.tsx`)}`);
}

// 更新 personalData.tsx
function updatePersonalData(articleData) {
  let personalDataContent = fs.readFileSync(personalDataPath, 'utf8');
  
  // 添加 import 语句
  const importName = articleData.id.replace(/-/g, '_');
  const importStatement = `import { ${importName} } from "../pages/articles/articlesData/${articleData.id}/${importName}";`;
  
  // 找到其他导入语句的位置，在最后一个导入后插入
  const importRegex = /import\s+.*from\s+["']\.\.\/pages\/articles\/articlesData\/.*["'];/g;
  const imports = personalDataContent.match(importRegex) || [];
  
  if (imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = personalDataContent.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;
    personalDataContent = personalDataContent.slice(0, insertPosition) + 
                         '\n' + importStatement + 
                         personalDataContent.slice(insertPosition);
  } else {
    // 如果没有找到其他导入，在文件开头添加
    personalDataContent = importStatement + '\n' + personalDataContent;
  }
  
  // 准备文章对象
  const articleObject = {
    id: articleData.id,
    title: articleData.title,
    summary: articleData.summary,
    content: importName,
    publishDate: formatDate(new Date()),
    tags: articleData.tags,
    readTime: parseInt(articleData.readTime) || 5,
    link: `https://blog.example.com/${articleData.id}`,
    type: articleData.type,
    ...(articleData.coverImage && { coverImage: articleData.coverImage })
  };
  
  // 将文章对象转换为字符串
  const articleString = `      {
        id: "${articleObject.id}",
        title: "${articleObject.title}",
        summary: "${articleObject.summary}",
        content: ${articleObject.content},
        publishDate: "${articleObject.publishDate}",
        tags: [${articleObject.tags.map(tag => `"${tag}"`).join(', ')}],
        readTime: ${articleObject.readTime},
        link: "${articleObject.link}",
        type: "${articleObject.type}",${articleObject.coverImage ? `\n        coverImage: "${articleObject.coverImage}",` : ''}
      },`;
  
  // 在中文版本的 articles 数组开头插入新文章
  const zhArticlesRegex = /(zh:\s*\{[\s\S]*?articles:\s*\[)/;
  personalDataContent = personalDataContent.replace(zhArticlesRegex, `$1\n${articleString}`);
  
  // 在英文版本的 articles 数组开头插入新文章（英文版本）
  const enArticleObject = {
    ...articleObject,
    title: articleData.titleEn || articleData.title,
    summary: articleData.summaryEn || articleData.summary
  };
  
  const enArticleString = `      {
        id: "${enArticleObject.id}",
        title: "${enArticleObject.title}",
        summary: "${enArticleObject.summary}",
        content: ${enArticleObject.content},
        publishDate: "${enArticleObject.publishDate}",
        tags: [${enArticleObject.tags.map(tag => `"${tag}"`).join(', ')}],
        readTime: ${enArticleObject.readTime},
        link: "${enArticleObject.link}",
        type: "${enArticleObject.type}",${enArticleObject.coverImage ? `\n        coverImage: "${enArticleObject.coverImage}",` : ''}
      },`;
  
  const enArticlesRegex = /(en:\s*\{[\s\S]*?articles:\s*\[)/;
  personalDataContent = personalDataContent.replace(enArticlesRegex, `$1\n${enArticleString}`);
  
  fs.writeFileSync(personalDataPath, personalDataContent);
  console.log(`✅ personalData.tsx 已更新`);
}

// 主函数
async function main() {
  console.log('🎉 欢迎使用文章创建工具！\n');
  
  try {
    // 收集文章信息
    const title = await askQuestion('📝 请输入文章标题: ');
    if (!title) {
      console.log('❌ 文章标题不能为空');
      process.exit(1);
    }
    
    const summary = await askQuestion('📋 请输入文章摘要: ');
    if (!summary) {
      console.log('❌ 文章摘要不能为空');
      process.exit(1);
    }
    
    const tagsInput = await askQuestion('🏷️  请输入文章标签（用逗号分隔）: ');
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    const type = await askQuestion('📂 请输入文章类型 (Engineering/Experience/AI/Thinking) [默认: Engineering]: ') || 'Engineering';
    
    const coverImage = await askQuestion('🖼️  请输入封面图片路径（可选）: ');
    
    // 询问是否需要英文版本
    const needEnglish = await askQuestion('🌍 是否需要添加英文版本？(y/n) [默认: n]: ');
    let titleEn, summaryEn;
    
    if (needEnglish.toLowerCase() === 'y' || needEnglish.toLowerCase() === 'yes') {
      titleEn = await askQuestion('🔤 请输入英文标题: ');
      summaryEn = await askQuestion('📝 请输入英文摘要: ');
    }
    
    const id = generateArticleId(title);
    
    console.log('\n📊 文章信息确认：');
    console.log(`   ID: ${id}`);
    console.log(`   标题: ${title}`);
    console.log(`   摘要: ${summary}`);
    console.log(`   标签: ${tags.join(', ')}`);
    console.log(`   类型: ${type}`);
    if (coverImage) console.log(`   封面: ${coverImage}`);
    if (titleEn) console.log(`   英文标题: ${titleEn}`);
    if (summaryEn) console.log(`   英文摘要: ${summaryEn}`);
    
    const confirm = await askQuestion('\n✅ 确认创建文章？(y/n) [默认: y]: ') || 'y';
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ 已取消创建');
      process.exit(0);
    }
    
    // 检查文章是否已存在
    const articleDir = path.join(articlesDataPath, id);
    if (fs.existsSync(articleDir)) {
      console.log(`❌ 文章目录已存在: ${articleDir}`);
      const overwrite = await askQuestion('是否覆盖现有文章？(y/n) [默认: n]: ') || 'n';
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ 已取消创建');
        process.exit(0);
      }
    }
    
    const articleData = {
      id,
      title,
      summary,
      tags,
      type,
      readTime,
      ...(coverImage && { coverImage }),
      ...(titleEn && { titleEn }),
      ...(summaryEn && { summaryEn })
    };
    
    // 创建文章文件
    createArticleFiles(articleData);
    
    // 更新 personalData.tsx
    updatePersonalData(articleData);
    
    console.log('\n🎉 文章创建完成！');
    console.log('\n📝 接下来你可以：');
    console.log(`   1. 编辑 Markdown 文件：${path.join(articleDir, 'data.md')}`);
    console.log(`   2. 如需要，可以修改 React 组件：${path.join(articleDir, `${id.replace(/-/g, '_')}.tsx`)}`);
    console.log(`   3. 运行 npm run dev 查看效果`);
    
  } catch (error) {
    console.error('❌ 创建文章时出现错误:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 运行主函数
main();