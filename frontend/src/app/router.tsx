import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../shared/contexts/ThemeContext';
import { LanguageProvider } from '../shared/contexts/LanguageContext';
import ThemeRenderer from "../shared/components/ThemeRenderer";
import {
  ArticlesPage,
  ArticleDetailPage,
  ArticleEditorPage,
} from "../features/articles";
import { personalDataMultiLang } from "../data/personalData";
import { CraftsPage, CraftsPageDetailPage, CraftEditorPage } from '../features/crafts';
import { DotsOverlay } from '../features/crafts/nodes/DotsOverlay';
import { AILogPage } from '../features/ai-log';

// 滚动重置组件
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 路由变化时立即滚动到顶部
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRouter: React.FC = () => {
  // GitHub Pages 用户页面使用根路径，无需 basename
  const basename = "";

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router basename={basename}>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={<ThemeRenderer data={personalDataMultiLang} />}
            />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles-editor" element={<ArticleEditorPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />

            <Route path='/crafts' element={<CraftsPage/>}/>
            <Route path='/crafts-editor' element={<CraftEditorPage/>}/>
            <Route path="/crafts/:id" element={<CraftsPageDetailPage />} />
            
            {/* AI LOG */}
            <Route path="/ai-log" element={<AILogPage />} />
            
            {/* CRAFTS DEMO */}
            <Route path="/crafts/demo/dots-overlay" element={<DotsOverlay/>}/>
          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default AppRouter;
