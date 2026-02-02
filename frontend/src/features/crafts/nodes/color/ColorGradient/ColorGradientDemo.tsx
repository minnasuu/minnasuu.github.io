import { ColorGradient } from ".";
import { useState } from "react";

export const ColorGradientDemo = () => {
    const [startColor, setStartColor] = useState("#ff0000");
    const [endColor, setEndColor] = useState("#00ff00");
    const [direction, setDirection] = useState("to right");

    const colorPairs = [
        { start: "#ff0000", end: "#00ff00", name: "红 → 绿" },
        { start: "#0000ff", end: "#ffff00", name: "蓝 → 黄" },
        { start: "#ff00ff", end: "#00ffff", name: "洋红 → 青" },
        { start: "#ff6b6b", end: "#4ecdc4", name: "珊瑚红 → 蓝绿" },
    ];

    const directions = [
        { value: "to right", label: "→ 右" },
        { value: "to bottom", label: "↓ 下" },
        { value: "to bottom right", label: "↘ 右下" },
        { value: "45deg", label: "45°" },
    ];

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">颜色渐变组件 Demo</h1>
                <p className="text-gray-600 mb-8">
                    对比 RGB、HSL 和 LCH 三种色彩空间的渐变效果
                </p>

                {/* 控制面板 */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">控制面板</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                起始颜色
                            </label>
                            <input
                                type="color"
                                value={startColor}
                                onChange={(e) => setStartColor(e.target.value)}
                                className="w-full h-10 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={startColor}
                                onChange={(e) => setStartColor(e.target.value)}
                                className="w-full mt-2 px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                结束颜色
                            </label>
                            <input
                                type="color"
                                value={endColor}
                                onChange={(e) => setEndColor(e.target.value)}
                                className="w-full h-10 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={endColor}
                                onChange={(e) => setEndColor(e.target.value)}
                                className="w-full mt-2 px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                渐变方向
                            </label>
                            <select
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            >
                                {directions.map((dir) => (
                                    <option key={dir.value} value={dir.value}>
                                        {dir.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                预设颜色
                            </label>
                            <select
                                onChange={(e) => {
                                    const pair = colorPairs[parseInt(e.target.value)];
                                    setStartColor(pair.start);
                                    setEndColor(pair.end);
                                }}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="">选择预设...</option>
                                {colorPairs.map((pair, index) => (
                                    <option key={index} value={index}>
                                        {pair.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 三种渐变对比 */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">渐变对比</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-3">RGB 色彩空间</h3>
                            <ColorGradient
                                type="RGB"
                                startColor={startColor}
                                endColor={endColor}
                                direction={direction}
                                className="w-full h-48 rounded-lg shadow-sm"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                标准 RGB 渐变，在 RGB 三通道间线性插值
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-3">HSL 色彩空间</h3>
                            <ColorGradient
                                type="HSL"
                                startColor={startColor}
                                endColor={endColor}
                                direction={direction}
                                className="w-full h-48 rounded-lg shadow-sm"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                HSL 渐变，基于色相、饱和度和亮度
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-3">LCH 色彩空间</h3>
                            <ColorGradient
                                type="LCH"
                                startColor={startColor}
                                endColor={endColor}
                                direction={direction}
                                className="w-full h-48 rounded-lg shadow-sm"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                LCH 渐变，感知均匀的色彩空间
                            </p>
                        </div>
                    </div>
                </div>

                {/* 预设颜色示例 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">预设颜色示例</h2>
                    <div className="space-y-6">
                        {colorPairs.map((pair, index) => (
                            <div key={index}>
                                <h3 className="text-md font-medium mb-3">{pair.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ColorGradient
                                        type="RGB"
                                        startColor={pair.start}
                                        endColor={pair.end}
                                        className="w-full h-24 rounded"
                                    />
                                    <ColorGradient
                                        type="HSL"
                                        startColor={pair.start}
                                        endColor={pair.end}
                                        className="w-full h-24 rounded"
                                    />
                                    <ColorGradient
                                        type="LCH"
                                        startColor={pair.start}
                                        endColor={pair.end}
                                        className="w-full h-24 rounded"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 说明文档 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">色彩空间说明</h2>
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">RGB</h3>
                            <p>
                                RGB 色彩空间是最常见的色彩模型，通过红、绿、蓝三个通道的线性插值生成渐变。
                                这种渐变可能在视觉上不够均匀，特别是在某些颜色组合下会产生灰暗的中间色。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">HSL</h3>
                            <p>
                                HSL 色彩空间基于色相（Hue）、饱和度（Saturation）和亮度（Lightness）。
                                渐变时会沿着色环移动，通常能产生更生动的中间色，但可能出现意外的色相偏移。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">LCH</h3>
                            <p>
                                LCH 色彩空间是感知均匀的色彩空间，基于 CIE LAB。
                                它能提供视觉上最均匀的渐变效果，中间色过渡更自然，是设计师的首选。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};