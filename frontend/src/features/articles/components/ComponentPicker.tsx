import React, { useState } from 'react';
import { Icon,  LandDialog } from '@suminhan/land-design';
import { getAllComponents, type ComponentConfig } from './interactive';

interface ComponentPickerProps {
  show: boolean;
  onClose: () => void;
  onSelect: (type: string, props: Record<string, any>) => void;
}

const ComponentPicker: React.FC<ComponentPickerProps> = ({ show, onClose, onSelect }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(null);
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});
  const components = getAllComponents();

  const handleComponentClick = (config: ComponentConfig) => {
    setSelectedComponent(config);
    setComponentProps({ ...config.defaultProps });
  };

  const handleInsert = () => {
    if (selectedComponent) {
      onSelect(selectedComponent.id, componentProps);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedComponent(null);
    setComponentProps({});
    onClose();
  };

  const handlePropChange = (key: string, value: any) => {
    setComponentProps(prev => ({ ...prev, [key]: value }));
  };

  return (
    <LandDialog
      show={show}
      title="插入交互组件"
      onClose={handleClose}
      size="large"
      submitLabel="插入"
      cancelLabel="取消"
      onSubmit={handleInsert}
      onCancel={handleClose}
      mask={true}
    >
      <div className="py-4 max-h-[80vh] overflow-y-auto">
        {!selectedComponent ? (
          // 组件选择列表
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              选择一个交互组件插入到文章中
            </p>
            <div className="grid grid-cols-2 gap-3">
              {components.map((config) => (
                <div
                  key={config.id}
                  onClick={() => handleComponentClick(config)}
                  className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {config.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 组件配置表单
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedComponent(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon name="arrow-left" size={20} strokeWidth={3} />
              </button>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedComponent.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedComponent.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedComponent.propsSchema &&
                Object.entries(selectedComponent.propsSchema).map(([key, schema]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {schema.label}
                    </label>
                    {schema.type === 'string' && (
                      <input
                        type="text"
                        value={componentProps[key] || ''}
                        onChange={(e) => handlePropChange(key, e.target.value)}
                        placeholder={schema.placeholder}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                      />
                    )}
                    {schema.type === 'number' && (
                      <input
                        type="number"
                        value={componentProps[key] || 0}
                        onChange={(e) => handlePropChange(key, Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                      />
                    )}
                    {schema.type === 'boolean' && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={componentProps[key] || false}
                          onChange={(e) => handlePropChange(key, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">启用</span>
                      </label>
                    )}
                  </div>
                ))}
            </div>

            {/* 预览 */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                预览
              </h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                {React.createElement(selectedComponent.component, componentProps)}
              </div>
            </div>
          </div>
        )}
      </div>
    </LandDialog>
  );
};

export default ComponentPicker;
