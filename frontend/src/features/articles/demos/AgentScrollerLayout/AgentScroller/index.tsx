import styled from "styled-components";
import AgentScrollLayout from "./components/AgentScrollLayout";
import {useCallback, useEffect, useState} from "react";
import ServerItem from "./components/ServerItem";
import AgentTextarea from "./components/AgentTextarea";
import UserItem from "./components/UserItem";
import TypewriterMarkdown from "./components/TypewriterMarkdown";

const AgentScroller: React.FC = () => {
  const [innerContent, setInnerContent] = useState<{id:string,content:React.ReactNode}[]>([]);
  const [answering, setAnswering] = useState<boolean>(false);
  useEffect(() => {
    const scroller = document.querySelector('.ckt-agent-scroll-layout');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
    })
  }, []);
  const scrollToBottom = useCallback(() => {
    const scroller = document.querySelector('.ckt-agent-scroll-layout');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
      behavior: 'smooth',
    })
  }, []);
  useEffect(() => {
    if (answering) {
      scrollToBottom()
      setTimeout(() => {
        setInnerContent([...innerContent, {id:`${Date.now()}`,content:<ServerItem>
          <TypewriterMarkdown
              content="# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
"
              speed={20}
              onComplete={() => console.log('Render complete!')}
          />
        </ServerItem>}]);
        setAnswering(false);
      }, 1000);
    }
  }, [answering])

  const loadHistory = () => {
   setTimeout(()=>{
     setInnerContent([{
       id: '111', content: <div className="flex column gap-24">
         <UserItem message="历史问了一个问题"/>
         <div>一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答一段历史回答</div>
       </div>
     }, ...innerContent])
   },2000)
  }
  return <div className="width-100 flex column bg-gray" style={{height:'400px'}}>
    <StyledLandContent className="flex-1 height-1 width-100 pb-24 flex column items-start mx-auto border-box" >
      <AgentScrollLayout onPreLoad={loadHistory} isEnd>
        {innerContent?.map(i => i.content)}
      </AgentScrollLayout>
      <AgentTextarea onSend={() => {
        setInnerContent([...innerContent, {id: `${Date.now()}`, content:<UserItem message={'问了一个问题'} />}]);
        setAnswering(true);
      }} />
    </StyledLandContent >
  </div>
}
const StyledLandContent = styled.div`
    max-width: 848px;
`
export default AgentScroller;
