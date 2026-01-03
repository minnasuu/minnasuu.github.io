import React from 'react';
import { VisualDotsConfigProvider, useVisualDotsConfig } from "./VisualDotsConfigContext";
import VisualDots from "./VisualDots";
import { Icon, LandSwitch, LandNumberInput } from "@suminhan/land-design";
import "./DotsOverlay.scss";
import { DemoLayout } from '../../components/DemoLayout';

const DotsOverlayContent: React.FC = () => {
  const { config, updateConfig, resetConfig, refreshKey, triggerRefresh } = useVisualDotsConfig();

  return (
    <div className="dots-overlay-demo">
      {/* 预览区域 */}
      <div className="preview-area">
        <VisualDots
          key={refreshKey}
          dotColor={config.dotColor}
          dotSize={config.dotSize}
          dotSpacing={config.dotSpacing}
          enableInteraction={config.enableInteraction}
          interactionRadius={config.interactionRadius}
          repulsionStrength={config.repulsionStrength}
          interactionTargetLevel={config.interactionTargetLevel}
          enableEntrance={config.enableEntrance}
          entranceDuration={config.entranceDuration}
        />
        <div className="preview-content">
          <h1>Dots Overlay</h1>
          <p>移动鼠标体验交互效果</p>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="control-panel">
        <div className="panel-header">
          <h2>参数配置</h2>
          <div className="panel-actions">
            <button className="action-btn" onClick={triggerRefresh} title="刷新预览">
              <Icon name="refresh" size={16} />
            </button>
            <button className="action-btn" onClick={resetConfig} title="重置参数">
              <Icon name="undo" size={16} />
            </button>
          </div>
        </div>

        <div className="panel-body">
          {/* 基础设置 */}
          <div className="config-section">
            <h3 className="section-title">基础设置</h3>
            
            <div className="config-item">
              <label>点颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={config.dotColor}
                  onChange={(e) => updateConfig({ dotColor: e.target.value })}
                />
                <span className="color-value">{config.dotColor}</span>
              </div>
            </div>

            <div className="config-item">
              <label>点大小</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={config.dotSize}
                  onChange={(e) => updateConfig({ dotSize: parseFloat(e.target.value) })}
                />
                <LandNumberInput
                  value={config.dotSize}
                  onChange={(val) => updateConfig({ dotSize: val ?? 0.8 })}
                  min={0.5}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>

            <div className="config-item">
              <label>点间距</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="4"
                  max="30"
                  step="1"
                  value={config.dotSpacing}
                  onChange={(e) => updateConfig({ dotSpacing: parseInt(e.target.value) })}
                />
                <LandNumberInput
                  value={config.dotSpacing}
                  onChange={(val) => updateConfig({ dotSpacing: val ?? 6 })}
                  min={4}
                  max={30}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* 交互设置 */}
          <div className="config-section">
            <h3 className="section-title">
              <span>交互设置</span>
              <LandSwitch
                checked={config.enableInteraction}
                onChange={(checked) => updateConfig({ enableInteraction: checked })}
              />
            </h3>

            {config.enableInteraction && (
              <>
                <div className="config-item">
                  <label>交互半径</label>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      min="30"
                      max="300"
                      step="5"
                      value={config.interactionRadius}
                      onChange={(e) => updateConfig({ interactionRadius: parseInt(e.target.value) })}
                    />
                    <LandNumberInput
                      value={config.interactionRadius}
                      onChange={(val) => updateConfig({ interactionRadius: val ?? 100 })}
                      min={30}
                      max={300}
                      step={5}
                    />
                  </div>
                </div>

                <div className="config-item">
                  <label>排斥强度</label>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={config.repulsionStrength}
                      onChange={(e) => updateConfig({ repulsionStrength: parseFloat(e.target.value) })}
                    />
                    <LandNumberInput
                      value={config.repulsionStrength}
                      onChange={(val) => updateConfig({ repulsionStrength: val ?? 0.05 })}
                      min={0.01}
                      max={0.5}
                      step={0.01}
                    />
                  </div>
                </div>

                <div className="config-item">
                  <label>监听层级</label>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={config.interactionTargetLevel}
                      onChange={(e) => updateConfig({ interactionTargetLevel: parseInt(e.target.value) })}
                    />
                    <LandNumberInput
                      value={config.interactionTargetLevel}
                      onChange={(val) => updateConfig({ interactionTargetLevel: val ?? 1 })}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 动画设置 */}
          <div className="config-section">
            <h3 className="section-title">
              <span>出场动画</span>
              <LandSwitch
                checked={config.enableEntrance}
                onChange={(checked) => {
                  updateConfig({ enableEntrance: checked });
                  if (checked) triggerRefresh();
                }}
              />
            </h3>

            {config.enableEntrance && (
              <div className="config-item">
                <label>动画时长</label>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={config.entranceDuration}
                    onChange={(e) => updateConfig({ entranceDuration: parseInt(e.target.value) })}
                  />
                  <LandNumberInput
                    value={config.entranceDuration}
                    onChange={(val) => updateConfig({ entranceDuration: val ?? 1000 })}
                    min={500}
                    max={5000}
                    step={100}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 拖尾设置 */}
          <div className="config-section">
            <h3 className="section-title">
              <span>拖尾效果</span>
              <LandSwitch
                checked={config.enableTrail}
                onChange={(checked) => updateConfig({ enableTrail: checked })}
              />
            </h3>

            {config.enableTrail && (
              <>
                <div className="config-item">
                  <label>拖尾颜色</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.trailColor}
                      onChange={(e) => updateConfig({ trailColor: e.target.value })}
                    />
                    <span className="color-value">{config.trailColor}</span>
                  </div>
                </div>

                <div className="config-item">
                  <label>持续时间</label>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={config.trailDuration}
                      onChange={(e) => updateConfig({ trailDuration: parseInt(e.target.value) })}
                    />
                    <LandNumberInput
                      value={config.trailDuration}
                      onChange={(val) => updateConfig({ trailDuration: val ?? 2000 })}
                      min={500}
                      max={5000}
                      step={100}
                    />
                  </div>
                </div>

                <div className="config-item">
                  <label>触发半径</label>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      min="20"
                      max="150"
                      step="5"
                      value={config.trailRadius}
                      onChange={(e) => updateConfig({ trailRadius: parseInt(e.target.value) })}
                    />
                    <LandNumberInput
                      value={config.trailRadius}
                      onChange={(val) => updateConfig({ trailRadius: val ?? 50 })}
                      min={20}
                      max={150}
                      step={5}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 代码预览 */}
        <div className="code-preview">
          <h3>使用代码</h3>
          <pre>
            <code>{`<VisualDots
  dotColor="${config.dotColor}"
  dotSize={${config.dotSize}}
  dotSpacing={${config.dotSpacing}}
  enableInteraction={${config.enableInteraction}}${config.enableInteraction ? `
  interactionRadius={${config.interactionRadius}}
  repulsionStrength={${config.repulsionStrength}}
  interactionTargetLevel={${config.interactionTargetLevel}}` : ''}
  enableEntrance={${config.enableEntrance}}${config.enableEntrance ? `
  entranceDuration={${config.entranceDuration}}` : ''}
/>`}</code>
          </pre>
          <button 
            className="copy-btn"
            onClick={() => {
              const code = `<VisualDots
  dotColor="${config.dotColor}"
  dotSize={${config.dotSize}}
  dotSpacing={${config.dotSpacing}}
  enableInteraction={${config.enableInteraction}}${config.enableInteraction ? `
  interactionRadius={${config.interactionRadius}}
  repulsionStrength={${config.repulsionStrength}}
  interactionTargetLevel={${config.interactionTargetLevel}}` : ''}
  enableEntrance={${config.enableEntrance}}${config.enableEntrance ? `
  entranceDuration={${config.entranceDuration}}` : ''}
/>`;
              navigator.clipboard.writeText(code);
            }}
          >
            <Icon name="copy" size={14} />
            复制代码
          </button>
        </div>
      </div>
    </div>
  );
};

export const DotsOverlay: React.FC = () => {
  return (
    <DemoLayout>
      <VisualDotsConfigProvider>
      <DotsOverlayContent />
    </VisualDotsConfigProvider>
    </DemoLayout>
  );
};

export default DotsOverlay;
