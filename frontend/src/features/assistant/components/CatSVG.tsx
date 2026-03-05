import React from 'react';

interface CatColors {
  body: string;       // 主体毛色 (#F7AC5E)
  bodyDark: string;   // 毛色深色/斑纹 (#D3753E)
  belly: string;      // 肚子/脸部浅色 (#FCEFD9)
  earInner: string;   // 耳朵内侧 (#F28686)
  eyes: string;       // 眼睛颜色 (#542615)
  nose: string;       // 鼻子 (#542615)
  blush: string;      // 腮红 (#F28686)
  stroke: string;     // 描边色 (#542615)
  apron: string;      // 围裙主色 (#BDBDBD)
  apronLight: string; // 围裙浅色 (#FEFFFE)
  apronLine: string;  // 围裙装饰线 (#BDBDBD)
  desk: string;       // 桌面主色 (#EBA87A)
  deskDark: string;   // 桌面暗部 (#B76C4F)
  deskLeg: string;    // 桌腿 (#D38A61)
}

interface CatSVGProps {
  colors: CatColors;
  className?: string;
}

const CatSVG: React.FC<CatSVGProps> = ({ colors, className }) => {
  const c = colors;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
    >
      {/* === DESK (table top) === */}
      <path d="M 185,143.96 L 170.06,116.76 C 168.98,114.77 167.64,114.77 165.81,114.77 H 33.78 C 31.41,114.77 30.08,115.38 28.64,118.08 L 15,143.36 V 148.98 C 15,151.66 16.84,152.88 19.06,152.88 H 180.16 C 183.62,152.88 185,150.91 185,149.26 V 143.96 Z" fill={c.desk} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 184.98,144.11 C 184.47,145.97 183.11,146.63 180.16,146.63 L 19.06,146.19 C 16.84,146.19 15.63,145.61 15,144.06 V 148.98 C 15,151.66 16.84,152.88 19.06,152.88 H 180.16 C 183.62,152.88 185,150.91 185,149.26 L 184.98,144.11 Z" fill={c.deskDark} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === DESK LEGS === */}
      <path d="M 23.91,153.81 V 189.99 C 23.91,192.56 25.44,193.29 27.27,193.29 H 30.59 C 33.16,193.29 33.78,191.82 33.78,189.99 V 153.81 H 23.91 Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 24.11,153.81 L 23.91,160.07 H 33.78 V 153.81 H 24.11 Z" fill={c.deskDark}/>
      <path d="M 39.41,153.81 V 171.66 C 39.41,173.91 40.44,174.54 42.72,174.54 H 44.91 C 47.48,174.54 47.75,172.61 47.75,170.32 L 47.91,153.81 H 39.41 Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 63.52,153.81 V 173.72 C 63.52,175.78 64.61,176.28 66.11,176.28 H 68.41 C 70.69,176.28 71.17,175.16 71.17,173.1 L 71.29,153.81 H 63.52 Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 129.09,153.81 V 173.31 C 129.09,175.56 130.11,176.19 131.79,176.19 H 133.52 C 135.77,176.19 136.09,174.85 136.09,173.02 V 153.81 H 129.09 Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 151.41,153.81 V 171.66 C 151.41,173.91 152.75,174.54 155.03,174.54 H 157.22 C 159.79,174.54 160.06,172.61 160.06,170.32 L 160.22,153.81 H 151.41 Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 166.21,153.81 V 189.41 C 166.21,191.66 167.69,193.08 169.68,193.08 H 172.73 C 175.29,193.08 175.61,190.98 175.61,189.41 V 153.81 H 166.21 Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 166.42,153.81 L 166.21,160.07 H 175.61 V 153.81 H 166.42 Z" fill={c.deskDark}/>

      {/* === FEET (left paw) === */}
      <path d="M 106.02,153.81 C 106.02,159.94 106.17,167.97 112.01,172.07 C 116.21,175.07 123.47,172.51 126.83,165.44 L 130.19,153.81 H 106.02 Z" fill={c.body} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 129.02,156.19 C 128.15,158.41 120.78,158.88 118.95,157.8 C 116.22,156.24 118.11,155.92 119.94,155.92 H 129.46 L 129.02,156.19 Z" fill={c.bodyDark}/>
      <path d="M 69.48,153.81 C 71.05,157.91 72.42,163.93 76.31,169.86 C 79.21,174.27 84.88,173.83 87.83,171.66 C 92.83,168.2 92.71,160.59 92.71,153.81 H 69.48 Z" fill={c.body} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 82.38,157.75 C 82.17,159.13 76.21,160.28 73.48,159.08 L 72.31,156.19 L 73.01,156.11 C 76.06,156.11 82.74,155.63 82.38,157.75 Z" fill={c.bodyDark}/>
      {/* Toe lines */}
      <path d="M 79.53,168.09 L 79.37,170.98" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 85.65,168.09 V 171.66" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 113.35,168.09 V 171.66" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 119.19,168.09 L 118.91,171.09" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === TAIL === */}
      <path d="M 144.75,114.77 C 148.89,112.15 150.72,106.07 149.15,94.71 C 147.21,80.91 155.19,69.35 165.65,68.51 C 170.92,68.08 173.62,72.02 173.62,74.91 C 173.62,78.96 170.36,80.91 166.73,83.16 C 161.62,86.16 161.05,88.99 161.31,98.98 C 161.52,106.89 158.78,111.29 156.21,114.77 H 144.75 Z" fill={c.body} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Tail stripes */}
      <path d="M 151.07,81.19 C 154.02,81.19 158.91,83.91 161.21,86.02 C 161.81,84.36 162.93,82.97 164.41,82.08 C 162.13,79.83 157.99,76.51 155.14,75.72 C 153.41,77.28 152.02,79.21 151.07,81.19 Z" fill={c.bodyDark}/>
      <path d="M 150.29,90.7 C 153.85,90.21 157.74,91.01 160.63,92.08 L 160.79,97.09 C 157.84,97.09 153.96,96.46 150.29,96.2 V 90.7 Z" fill={c.bodyDark}/>
      <path d="M 150.61,101.24 C 153.45,101.24 157.48,102.21 159.42,103.05 C 158.95,105.11 158.21,107.36 157.32,108.82 C 155.04,107.83 150.39,105.69 147.23,105.06 C 147.97,103.98 149.21,101.82 150.61,101.24 Z" fill={c.bodyDark}/>

      {/* === BODY === */}
      <path d="M 66.81,78.07 C 60.48,88.28 55.64,102.03 55.22,114.77 H 144.75 C 144.75,105.11 139.48,90.12 133.79,78.07 H 66.81 Z" fill={c.body} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Body stripes */}
      <path d="M 61.07,95.34 C 64.12,95.34 68.22,94.21 69.84,93.13 C 71.78,91.92 70.21,90.7 68.11,89.2 C 66.72,88.21 65.39,87.13 64.12,85.97 C 62.79,88.7 61.56,91.65 60.43,94.71 L 61.07,95.34 Z" fill={c.bodyDark}/>
      <path d="M 57.81,102.18 C 59.75,102.18 60.92,102.61 62.14,103.24 L 60.7,106.13 L 57.08,105.11 L 57.81,102.18 Z" fill={c.bodyDark}/>
      <path d="M 137.99,94.12 C 135.42,94.12 132.01,93.55 130.12,92.33 C 128.18,91.11 128.76,90.12 130.12,88.9 C 131.69,87.51 133.11,86.53 134.63,85.46 L 138.88,94.12 H 137.99 Z" fill={c.bodyDark}/>
      <path d="M 136.31,102.72 C 138.69,102.72 140.11,103.84 141.84,105.06 L 140.72,108.01 L 135.14,106.07 L 136.31,102.72 Z" fill={c.bodyDark}/>

      {/* === HEAD === */}
      <path d="M 145.69,52.82 C 145.38,44.91 142.81,38.83 139.86,34.32 C 141.43,26.72 140.54,7.41 134.85,6.29 C 130.17,5.36 119.19,13.71 116.35,16.27 C 111.13,14.71 105.91,13.97 99.86,13.97 C 93.53,13.97 88.31,14.71 83.37,16.27 C 80.11,13.17 71.06,5.14 64.91,6.29 C 58.26,7.51 58.11,24.05 58.84,33.71 C 55.59,38.73 53.45,44.91 53.13,51.23 C 52.39,62.74 57.92,72.95 66.71,78.07 C 72.99,81.75 75.94,82.49 75.94,82.49 H 124.81 C 124.81,82.49 127.91,81.11 132.74,77.44 C 140.12,72.02 146.01,63.41 145.69,52.82 Z" fill={c.body} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Head stripes */}
      <path d="M 95.51,14.81 L 96.89,31.76 C 97.16,34.97 101.41,36.24 102.58,32.13 C 103.42,28.97 104.31,16.01 104.31,16.01 C 101.41,15.53 98.46,15.15 95.51,14.81 Z" fill={c.bodyDark}/>
      <path d="M 92.15,15.49 L 92.72,27.26 C 92.88,29.98 89.36,31.81 87.98,27.61 L 85.03,17.13 C 87.31,16.39 89.88,15.86 92.15,15.49 Z" fill={c.bodyDark}/>
      <path d="M 108.14,15.75 L 107.72,27.31 C 107.61,30.15 110.51,31.22 111.89,27.31 L 115.25,16.82 C 113.01,16.27 110.51,15.86 108.14,15.75 Z" fill={c.bodyDark}/>
      <path d="M 55.75,44.17 L 65.78,47.74 C 68.16,48.62 67.58,51.19 63.59,51.71 C 60.92,52.08 58.07,51.71 54.71,51.19 C 54.71,48.62 55.02,46.42 55.75,44.17 Z" fill={c.bodyDark}/>
      <path d="M 143.41,44.17 L 134.81,47.74 C 132.72,48.62 132.72,51.03 136.39,51.5 C 138.81,51.82 142.74,51.34 145.31,50.5 C 145.21,48.26 144.53,45.95 143.41,44.17 Z" fill={c.bodyDark}/>
      <path d="M 55.75,53.84 L 63.11,56.73 C 65.78,57.75 65.16,60.32 61.53,60.74 L 54.61,61.48 L 54.18,53.84 H 55.75 Z" fill={c.bodyDark}/>
      <path d="M 145.42,53.21 L 139.58,54.43 C 137.65,54.85 137.81,57.16 139.74,57.43 L 145.74,58.4 L 146.31,53.21 H 145.42 Z" fill={c.bodyDark}/>

      {/* === FACE (light area) === */}
      <path d="M 143.47,64.21 C 138.75,73.01 127.34,86.16 100.18,86.16 C 77.21,86.16 63.32,75.95 57.64,66.06 C 62.75,67.45 75.89,68.98 84.94,60.11 C 89.94,55.16 90.92,49.69 98.88,49.69 C 106.84,49.69 108.62,55.61 113.02,59.75 C 120.09,66.42 130.91,67.11 143.47,64.21 Z" fill={c.belly}/>

      {/* === BLUSH === */}
      <path d="M 74.11,56.05 C 70.01,55.52 68.02,57.43 67.91,59.18 C 67.75,61.75 69.94,62.59 72.21,62.75 C 76.15,63.01 77.72,61.64 77.88,59.7 C 78.04,57.75 76.78,56.36 74.11,56.05 Z" fill={c.blush}/>
      <path d="M 127.65,55.61 C 123.25,55.35 121.47,57.27 121.47,59.23 C 121.47,61.33 123.25,62.59 127.08,62.59 C 130.75,62.59 132.48,61.02 132.48,59.23 C 132.48,57.43 130.75,55.78 127.65,55.61 Z" fill={c.blush}/>

      {/* === EYES === */}
      <path d="M 81.24,46.16 C 77.62,46.16 76.45,49.05 76.45,50.81 C 76.45,53.64 78.44,55.61 81.24,55.61 C 84.49,55.61 85.51,52.93 85.51,50.81 C 85.51,48.3 83.89,46.16 81.24,46.16 Z" fill={c.eyes}/>
      <path d="M 118.86,46.16 C 115.35,46.16 114.23,49.05 114.23,50.81 C 114.23,53.64 116.22,55.35 118.86,55.35 C 122.06,55.35 123.42,52.93 123.42,50.81 C 123.42,48.62 121.74,46.16 118.86,46.16 Z" fill={c.eyes}/>

      {/* === NOSE & MOUTH === */}
      <path d="M 92.41,62.32 C 92.72,64.11 94.45,64.74 96.23,64.74 C 98.93,64.74 99.96,62.59 99.96,60.11 C 99.96,62.32 101.69,64.11 104.25,64.11 C 106.34,64.11 107.28,62.95 107.44,62.01" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 97.75,55.61 H 102.06 C 103.73,55.61 103.99,57.7 102.06,58.54 L 100.12,59.43 C 99.29,59.85 98.3,59.22 97.42,58.43 C 95.85,57.11 96.01,55.61 97.75,55.61 Z" fill={c.nose}/>

      {/* === WHISKERS === */}
      <path d="M 47.12,52.51 L 59.32,53.95" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 47.75,62.32 L 59.32,59.22" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 152.59,52.51 L 140.12,53.95" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 152.01,62.17 L 139.85,59.22" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === INNER EARS === */}
      <path d="M 75.19,20.04 C 76.21,18.82 68.79,11.71 66.65,12.03 C 63.29,12.55 63.29,21.95 63.91,29.24 C 64.02,30.13 72.91,22.27 75.19,20.04 Z" fill={c.earInner}/>
      <path d="M 124.21,20.04 C 123.19,18.82 130.61,11.71 133.12,12.03 C 136.17,12.45 136.75,22.11 135.62,29.87 C 135.47,30.85 127.19,22.81 124.21,20.04 Z" fill={c.earInner}/>

      {/* === APRON === */}
      <path d="M 67.49,136.91 L 73.9,119.71 C 74.21,118.78 75.15,118.52 76.09,118.78 C 78.66,119.56 83.44,120.19 87.11,120.19 C 90.31,120.19 91.79,117.77 93.62,117.77 C 95.85,117.77 97.84,119.14 99.72,119.14 C 101.45,119.14 103.73,117.77 105.41,117.77 C 107.74,117.77 108.15,120.19 112.56,120.19 C 116.65,120.19 120.32,119.11 124.11,118.63 C 125.73,118.41 127.06,118.94 127.53,120.4 L 132.8,136.91 V 139.32 H 67.49 V 136.91 Z" fill={c.apron} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 68.38,136.12 L 73.85,119.82 C 74.16,118.89 75.15,118.52 76.09,118.78 C 78.66,119.56 82.23,120.19 86.27,120.19 C 89.84,120.19 91.89,118.94 93.62,118.94 C 95.85,118.94 97.84,120.31 99.72,120.31 C 101.45,120.31 103.73,118.94 105.41,118.94 C 107.74,118.94 108.72,120.19 112.82,120.19 C 116.91,120.19 120.85,119.11 123.95,118.63 C 125.22,118.41 126.6,118.94 127.02,120.4 L 132.01,135.69 L 129.73,136.12 H 68.38 Z" fill={c.apronLight} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Apron lines */}
      <path d="M 75.62,127.81 L 93.99,128.13" stroke={c.apronLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 75.05,131.43 L 93.99,131.75" stroke={c.apronLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 100.04,120.09 V 137.73" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Apron bottom folds */}
      <path d="M 67.91,137.73 C 70.91,136.7 74.06,136.22 77.26,136.22 H 87.73 C 92.41,136.22 97.31,137.25 99.72,138.81 H 67.91 V 137.73 Z" fill={c.apron} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 131.64,137.73 C 128.64,136.7 125.49,136.22 122.29,136.22 H 111.83 C 107.14,136.22 102.25,137.25 99.83,138.81 H 131.64 V 137.73 Z" fill={c.apron} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === ARMS (paws) === */}
      <path d="M 90.15,108.82 C 84.93,107.75 78.29,111.12 77.21,115.42 C 79.25,117.77 82.81,120.72 87.11,120.72 C 90.95,120.72 93.94,118.99 94.2,115.89 C 94.41,113.32 92.94,110.22 90.15,108.82 Z" fill={c.belly}/>
      <path d="M 108.72,108.82 C 113.94,107.75 120.58,111.12 121.66,115.42 C 119.62,117.77 116.06,120.72 111.76,120.72 C 107.93,120.72 104.93,118.99 104.67,115.89 C 104.46,113.32 105.93,110.22 108.72,108.82 Z" fill={c.belly}/>
      <path d="M 67.38,103.66 C 70.64,110.28 75.42,118.89 84.11,121.14 C 87.94,122.16 91.73,120.72 92.81,118.15 C 94.03,115.05 92.04,110.8 88.79,106.13 C 86.65,102.92 85.71,100.67 85.51,97.83" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 85.14,117.12 L 86.71,120.19" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 90.62,115.21 L 91.79,118.1" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 132.64,103.66 C 130.07,109.94 124.86,118.1 116.91,120.61 C 113.07,121.83 109.19,121.09 107.46,118.99 C 105.23,116.16 106.11,111.6 109.21,107.25 C 111.73,103.61 113.35,100.62 114.23,97.83" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 113.61,117.12 L 112.19,120.19" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 108.72,115.21 L 107.6,117.72" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === BROOM (right side) === */}
      <path d="M 142.15,132.22 L 157.11,120.03 C 158.43,118.94 160.85,118.94 161.88,120.03 C 163.1,121.45 163.21,124.17 161.63,125.44 L 148.73,136.43 C 146.79,138.13 144.22,138.81 140.28,138.81 C 138.71,138.81 139.75,135.6 142.15,132.22 Z" fill={c.deskDark} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 144.38,131.1 L 157.74,120.06 L 160.43,123.63 L 147.75,134.93 L 144.38,131.1 Z" fill={c.body} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 142.81,132.99 L 145.91,136.22" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default CatSVG;
