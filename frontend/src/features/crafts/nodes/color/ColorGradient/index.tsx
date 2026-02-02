import clsx from "clsx";
import type { CSSProperties } from "react";
import { useMemo } from "react";

export interface ColorGradientProps {
    /** 颜色渐变类型 */
    type?: 'RGB' | 'HSL' | 'LCH';
    startColor?: string;
    endColor?: string;
    /** 渐变方向，默认为 to right */
    direction?: string;
    style?: CSSProperties;
    className?: string;
}

export const ColorGradient = ({
    type = 'RGB',
    startColor = '#ff0000',
    endColor = '#00ff00',
    direction = 'to right',
    style,
    className = '',
}: ColorGradientProps) => {
    const gradientStyle = useMemo(() => {
        let background: string;

        switch (type) {
            case 'RGB':
                // RGB 渐变：使用标准 linear-gradient
                background = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
                break;

            case 'HSL':
                // HSL 渐变：使用 color-mix 或转换为 HSL 色彩空间
                // 方式1: 使用 CSS color-mix (更现代的方式)
                background = `linear-gradient(${direction} in hsl, ${startColor}, ${endColor})`;
                break;

            case 'LCH':
                // LCH 渐变：使用 LCH 色彩空间
                // LCH 提供了更均匀的感知渐变
                background = `linear-gradient(${direction} in lch, ${startColor}, ${endColor})`;
                break;

            default:
                background = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
        }

        return {
            background,
            ...style,
        };
    }, [type, startColor, endColor, direction, style]);

    return (
        <div
            style={gradientStyle}
            className={clsx('w-full h-full', className)}
        />
    );
};