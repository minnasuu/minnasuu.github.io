/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'markdown-it' {
  const MarkdownIt: any;
  export default MarkdownIt;
}
declare module 'react-markdown-editor-lite';
