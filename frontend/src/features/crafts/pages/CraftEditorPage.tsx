import React, { useState, useEffect } from "react";
import { Icon, LandButton } from "@suminhan/land-design";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import { verifyEditorPassword } from "../../../shared/utils/backendClient";
import CraftsPage from "./CraftsPage";
import "../styles/CraftEditorPage.scss";

const CraftEditorPage: React.FC = () => {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // 检查是否已经通过验证（使用 sessionStorage）
  useEffect(() => {
    const authToken = sessionStorage.getItem("craft_editor_auth");
    if (authToken === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  // 验证密码
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setIsVerifying(true);

    try {
      const result = await verifyEditorPassword(passwordInput);
      if (result.success) {
        sessionStorage.setItem("craft_editor_auth", "authenticated");
        setIsAuthenticated(true);
      } else {
        setPasswordError(
          language === "zh" ? "密码错误，请重试" : "Incorrect password, please try again"
        );
      }
    } catch (error) {
      setPasswordError(
        language === "zh" ? "验证失败，请稍后重试" : "Verification failed, please try again later"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // 如果未验证，显示密码输入页面
  if (!isAuthenticated) {
// if(false){
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#202020] rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-indigo-900/30 mb-4">
              <Icon name="lock" size={30} strokeWidth={3} className="text-gray-800 dark:text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === "zh" ? "编辑器访问验证" : "Editor Access Verification"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === "zh"
                ? "请输入密码以访问 Craft 编辑器"
                : "Please enter password to access Craft Editor"}
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 items-center">
            <div className="w-full">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={language === "zh" ? "请输入访问密码" : "Enter password"}
                autoFocus
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all outline-none"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon name="warning" size={16} strokeWidth={2} />
                  {passwordError}
                </p>
              )}
            </div>

            <LandButton
              type="background"
              text={language === "zh" ? "验证访问" : "Verify Access"}
              onClick={handlePasswordSubmit}
              disabled={!passwordInput || isVerifying}
            />

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                {language === "zh"
                  ? "提示：密码在后端安全验证，不会暴露到前端"
                  : "Tip: Password is verified securely on the backend"}
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 验证通过后，显示带编辑功能的 CraftsPage
  return <CraftsPage editorMode={true} />;
};

export default CraftEditorPage;
