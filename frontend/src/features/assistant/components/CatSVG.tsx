import React from 'react';

export interface CatColors {
  body: string;
  bodyDark: string;
  belly: string;
  earInner: string;
  eyes: string;
  nose: string;
  blush: string;
  stroke: string;
  apron: string;
  apronLight: string;
  apronLine: string;
  desk: string;
  deskDark: string;
  deskLeg: string;
  paw: string | string[];
  tail: string;
  faceDark: string;
  month: string;
  head: string;
  bodyDarkBottom: string;
  leg: string|string[];
  headTopLeft: string;
  headTopRight: string;
}

interface CatSVGProps {
  colors: CatColors;
  className?: string;
}

const CatSVG: React.FC<CatSVGProps> = ({ colors, className }) => {
  const c = colors;
  const paw = (i: number) =>
    Array.isArray(c.paw) ? (c.paw[i] ?? c.paw[0]) : c.paw;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
    >
      {/* === TAIL (fill) === */}
      <g className="cat-tail">
      <path d="M144.75 114.769C148.89 112.149 150.72 106.069 149.15 94.709C147.21 80.909 155.19 69.349 165.65 68.509C170.92 68.079 173.62 72.019 173.62 74.909C173.62 78.959 170.36 80.909 166.73 83.159C161.62 86.159 161.05 88.989 161.31 98.979C161.52 106.889 154.57 119.52 152 123L144.75 114.769Z" fill={c.tail||c.body}/>
      {/* Tail stripes */}
      <path d="M151.07 81.1888C154.02 81.1888 160.2 84.39 162.5 86.5L167.5 82.5C165.22 80.25 157.35 75.79 154.5 75L151.07 81.1888Z" fill={c.tail==c.body ?c.bodyDark: c.tail}/>
      <path d="M149.5 89.4992C153.06 89.0092 157.739 90.0089 160.629 91.0789L160.789 96.0889C157.839 96.0889 153.67 95.26 150 95L149.5 89.4992Z" fill={c.tail==c.body ?c.bodyDark: c.tail}/>
      <path d="M150.5 100.5C153.34 100.5 159.25 101.97 161.19 102.81L159.09 108.58C156.81 107.59 152.66 106.13 149.5 105.5L150.5 100.5Z" fill={c.tail==c.body ?c.bodyDark: c.tail}/>
      </g>
      {/* === TAIL (stroke) === */}
      <path className="cat-tail" d="M144.75 114.769C148.89 112.149 150.72 106.069 149.15 94.709C147.21 80.909 155.19 69.349 165.65 68.509C170.92 68.079 173.62 72.019 173.62 74.909C173.62 78.959 170.36 80.909 166.73 83.159C161.62 86.159 161.05 88.989 161.31 98.979C161.52 106.889 154.57 120.02 152 123.5L144.75 114.769Z" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === DESK LEGS === */}
      <path d="M23.9102 152.809V188.989C23.9102 191.559 25.4402 192.289 27.2702 192.289H30.5902C33.1602 192.289 33.7802 190.819 33.7802 188.989V152.809H23.9102Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M63.5195 152.809V172.719C63.5195 174.779 64.6095 175.279 66.1095 175.279H68.4095C70.6895 175.279 71.1695 174.159 71.1695 172.099L71.2895 152.809H63.5195Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M129.09 152.809V172.309C129.09 174.559 130.11 175.189 131.79 175.189H133.52C135.77 175.189 136.09 173.849 136.09 172.019V152.809H129.09Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M151.41 152.809V170.659C151.41 172.909 152.75 173.539 155.03 173.539H157.22C159.79 173.539 160.06 171.609 160.06 169.319L160.22 152.809H151.41Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M166.211 152.809V188.409C166.211 190.659 167.691 192.079 169.681 192.079H172.731C175.291 192.079 175.611 189.979 175.611 188.409V152.809H166.211Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === DESK (table top) === */}
      <path d="M185 143.96L170.06 116.76C168.98 114.77 167.64 114.77 165.81 114.77H33.78C31.41 114.77 30.08 115.38 28.64 118.08L15 143.36V148.98C15 151.66 16.84 152.88 19.06 152.88H180.16C183.62 152.88 185 150.91 185 149.26V143.96Z" fill={c.desk} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M184.98 144.109C184.47 145.969 183.11 146.629 180.16 146.629L19.06 146.189C16.84 146.189 15.63 145.609 15 144.059V148.979C15 151.659 16.84 152.879 19.06 152.879H180.16C183.62 152.879 185 150.909 185 149.259L184.98 144.109Z" fill={c.deskDark} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M39.4102 152.809V170.659C39.4102 172.909 40.4402 173.539 42.7202 173.539H44.9102C47.4802 173.539 47.7502 171.609 47.7502 169.319L47.9102 152.809H39.4102Z" fill={c.deskLeg} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === FEET === */}
      <path d="M106.02 153.809C106.02 159.939 106.17 167.969 112.01 172.069C116.21 175.069 123.47 172.509 126.83 165.439L130.19 153.809H106.02Z" fill={Array.isArray(c.leg) ?c.leg[3]: (c.leg||c.body) } stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M107.5 162C107.5 165.459 110 170.5 113.5 172C116 173.071 120.163 172.989 123.499 169C125.267 166.666 126 165.5 127 161.5C119.418 163.169 115.083 163.08 107.5 162Z" fill={paw(1)}/>
      <path d="M69.4805 153.809C71.0505 157.909 72.4205 163.929 76.3105 169.859C79.2105 174.269 84.8805 173.829 87.8305 171.659C92.8305 168.199 92.7105 160.589 92.7105 153.809H69.4805Z" fill={Array.isArray(c.leg) ?c.leg[2]: (c.leg||c.body) } stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M91.5 161.5C91 165.5 90 169.5 86.5 171.5C84.1384 172.849 79.5 173.5 76.5009 168.5C75 165.5 74.5 165 73 161C80.1439 162.641 84.1724 162.834 91.5 161.5Z" fill={paw(0)}/>
      {/* Toe lines */}
      <path d="M79.5295 168.09L79.5291 172" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M85.6504 168.09V172" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M113.35 168.09L113.5 172.5" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M120.19 168.09L120 172" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === BODY (fill) === */}
      <path d="M66.8107 76.0703C60.4807 86.2803 55.6407 102.03 55.2207 114.77H144.751C144.751 105.11 139.481 88.1203 133.791 76.0703H66.8107Z" fill={c.body}/>

      {/* Body stripes */}
      <path d="M60.4059 95.3387C63.6658 95.3387 68.048 94.2087 69.7794 93.1287C71.8529 91.9187 70.1749 90.6987 67.9304 89.1987C66.4447 88.2087 63.8566 87.16 62.4992 86C61.0777 88.73 59.7129 92.13 58.9355 95.3387H60.4059Z" fill={c.bodyDarkBottom||c.bodyDark}/>
      <path d="M57.8101 102.18C59.7501 102.18 60.9201 102.61 62.1401 103.24L60.7001 106.13L57.0801 105.11L57.8101 102.18Z" fill={c.bodyDarkBottom||c.bodyDark}/>
      <path d="M137.99 94.12C135.42 94.12 132.01 93.55 130.12 92.33C128.18 91.11 128.76 90.12 130.12 88.9C131.69 87.51 135.23 85.91 136.75 84.84L141 94.12H137.99Z" fill={c.bodyDarkBottom||c.bodyDark}/>
      <path d="M136.311 102.719C138.691 102.719 141.27 102.78 143 104L143.5 108L135.141 106.069L136.311 102.719Z" fill={c.bodyDarkBottom||c.bodyDark}/>

      {/* === BODY (stroke) === */}
      <path d="M66.8107 76.0703C60.4807 86.2803 55.6407 102.03 55.2207 114.77H144.751C144.751 105.11 139.481 88.1203 133.791 76.0703H66.8107Z" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* === HEAD (fill) === */}
      <path d="M145.691 52.8215C145.381 44.9115 142.811 38.8315 139.861 34.3215C141.431 26.7215 140.541 7.41148 134.851 6.29148C130.171 5.36148 119.191 13.7115 116.351 16.2715C111.131 14.7115 105.911 13.9715 99.8606 13.9715C93.5306 13.9715 88.3106 14.7115 83.3706 16.2715C80.1106 13.1715 71.0606 5.14148 64.9106 6.29148C58.2606 7.51148 58.1106 24.0515 58.8406 33.7115C55.5906 38.7315 53.4506 44.9115 53.1306 51.2315C52.3906 62.7415 57.9206 72.9515 66.7106 78.0715C72.9906 81.7515 75.9406 82.4915 75.9406 82.4915H124.811C124.811 82.4915 127.911 81.1115 132.741 77.4415C140.121 72.0215 146.011 63.4115 145.691 52.8215Z" fill={c.head || c.body}/>
      <path xmlns="http://www.w3.org/2000/svg" d="M83.3709 16.2715C88.3109 14.7115 93.5309 13.9715 99.8609 13.9715C102 41.5 78.5 54 53.1309 51.2315C53.4509 44.9115 55.5909 38.7315 58.8409 33.7115C58.1109 24.0515 58.2609 7.51148 64.9109 6.29148C71.0609 5.14148 80.1109 13.1715 83.3709 16.2715Z" fill={c.headTopLeft||c.head} />
      <path xmlns="http://www.w3.org/2000/svg" d="M139.86 34.3207C142.81 38.8307 145.38 44.9107 145.69 52.8207C125 56 96.5001 41.5 99.8597 13.9707C105.91 13.9707 111.13 14.7107 116.35 16.2707C119.19 13.7107 130.17 5.36067 134.85 6.29067C140.54 7.41067 141.43 26.7207 139.86 34.3207Z" fill={c.headTopRight||c.head} />
      {/* Head stripes */}
      <path d="M95 14L96.3898 30.7586C96.6598 33.9686 100.91 35.2386 102.08 31.1286C102.92 27.9686 104 14 104 14C101 14.0025 98 14.0002 95 14Z" fill={c.bodyDark}/>
      <path d="M92.12 15L92.69 26.77C92.85 29.49 89.33 31.32 87.95 27.12L85 16.64C87.28 15.9 89.85 15.37 92.12 15Z" fill={c.bodyDark}/>
      <path d="M108 15.5L107.72 27.31C107.61 30.15 110.51 31.22 111.89 27.31L115.25 16.82C113.01 16.27 110.37 15.61 108 15.5Z" fill={c.bodyDark}/>
      <path d="M54.7509 44.1719L64.7809 47.7419C67.1609 48.6219 66.5809 51.1919 62.5909 51.7119C59.9209 52.0819 57.0709 51.7119 53.7109 51.1919C53.7109 48.6219 54.0209 46.4219 54.7509 44.1719Z" fill={c.bodyDark}/>
      <path d="M143.41 44.1719L134.81 47.7419C132.72 48.6219 132.72 51.0319 136.39 51.5019C138.81 51.8219 142.74 51.3419 145.31 50.5019C145.21 48.2619 144.53 45.9519 143.41 44.1719Z" fill={c.bodyDark}/>
      <path d="M55.7506 53.8398L63.1106 56.7298C65.7806 57.7498 65.1606 60.3198 61.5306 60.7398L54.6106 61.4798L54 53.8398H55.7506Z" fill={c.bodyDark}/>
      <path d="M145.421 53.2109L139.581 54.4309C137.651 54.8509 137.811 57.1609 139.741 57.4309L145.741 58.4009L146.311 53.2109H145.421Z" fill={c.bodyDark}/>

      {/* === HEAD (stroke) === */}
      <path d="M75.9406 82.4915C75.9406 82.4915 72.9906 81.7515 66.7106 78.0715C57.9206 72.9515 52.3906 62.7415 53.1306 51.2315C53.4506 44.9115 55.5906 38.7315 58.8406 33.7115C58.1106 24.0515 58.2606 7.51148 64.9106 6.29148C71.0606 5.14148 80.1106 13.1715 83.3706 16.2715C88.3106 14.7115 93.5306 13.9715 99.8606 13.9715C105.911 13.9715 111.131 14.7115 116.351 16.2715C119.191 13.7115 130.171 5.36148 134.851 6.29148C140.541 7.41148 141.431 26.7215 139.861 34.3215C142.811 38.8315 145.381 44.9115 145.691 52.8215C146.011 63.4115 140.121 72.0215 132.741 77.4415C127.911 81.1115 124.811 82.4915 124.811 82.4915" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === FACE (light area) === */}
      <path d="M142.83 63.52C138.11 72.32 128.5 87 99.54 85.47C72 84.5 59.5 74 57 65.37C62.11 66.76 75.25 68.29 84.3 59.42C89.3 54.47 90.28 49 98.24 49C106.2 49 107.98 54.92 112.38 59.06C119.45 65.73 130.27 66.42 142.83 63.52Z" fill={c.belly}/>

      {/* === FACE (dark area) === */}
      <g xmlns="http://www.w3.org/2000/svg" filter="url(#filter0_f_2229_6777)">
      <ellipse cx="99" cy="57.5" rx="27" ry="26.5" fill={c.faceDark} />
      </g>

      {/* === BLUSH === */}
      <path d="M74.1106 56.0509C70.0106 55.5209 68.0206 57.4309 67.9106 59.1809C67.7506 61.7509 69.9406 62.5909 72.2106 62.7509C76.1506 63.0109 77.7206 61.6409 77.8806 59.7009C78.0406 57.7509 76.7806 56.3609 74.1106 56.0509Z" fill={c.blush}/>
      <path d="M127.651 55.6097C123.251 55.3497 121.471 57.2697 121.471 59.2297C121.471 61.3297 123.251 62.5897 127.081 62.5897C130.751 62.5897 132.481 61.0197 132.481 59.2297C132.481 57.4297 130.751 55.7797 127.651 55.6097Z" fill={c.blush}/>

      {/* === EYES === */}
      <path d="M83.1722 48C80.7748 48 80 49.8349 80 50.9524C80 52.7492 81.3179 54 83.1722 54C85.3245 54 86 52.2984 86 50.9524C86 49.3587 84.9272 48 83.1722 48Z" fill={c.eyes}/>
      <path d="M117.023 48C114.731 48 114 49.8868 114 51.0359C114 52.8836 115.299 54 117.023 54C119.112 54 120 52.42 120 51.0359C120 49.6061 118.903 48 117.023 48Z" fill={c.eyes}/>

      {/* === NOSE & MOUTH === */}
      <path d="M92.4102 62.3194C92.7202 64.1094 94.4502 64.7394 96.2302 64.7394C98.9302 64.7394 100 61.98 100 59.5C100 61.71 101.761 64.7394 104.321 64.7394C106.411 64.7394 107.84 63.2594 108 62.3194" stroke={c.month||c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M97.7509 55.6094H102.061C103.731 55.6094 104 57 102 58.5L100.5 59.5C99.67 59.92 98.3009 59.2194 97.4209 58.4294C95.8509 57.1094 96.0109 55.6094 97.7509 55.6094Z" fill={c.nose}/>

      {/* === WHISKERS === */}
      <path d="M47.1191 52.5117L59.3191 53.9517" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M47 45L59.2 46.44" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M47.75 62.3187L59.32 59.2188" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M152.589 52.5117L140.119 53.9517" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M152.47 45L140 46.44" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M152.01 62.1687L139.85 59.2188" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === INNER EARS === */}
      <path d="M75.1904 20.04C76.2104 18.82 68.7904 11.71 66.6504 12.03C63.2904 12.55 63.2904 21.95 63.9104 29.24C64.0204 30.13 72.9104 22.27 75.1904 20.04Z" fill={c.earInner}/>
      <path d="M124.211 20.04C123.191 18.82 130.611 11.71 133.121 12.03C136.171 12.45 136.751 22.11 135.621 29.87C135.471 30.85 127.191 22.81 124.211 20.04Z" fill={c.earInner}/>

      {/* === APRON === */}
      <path d="M67.4902 136.91L73.9002 119.71C74.2102 118.78 75.1502 118.52 76.0902 118.78C78.6602 119.56 83.4402 120.19 87.1102 120.19C90.3102 120.19 91.7902 117.77 93.6202 117.77C95.8502 117.77 97.8402 119.14 99.7202 119.14C101.45 119.14 103.73 117.77 105.41 117.77C107.74 117.77 108.15 120.19 112.56 120.19C116.65 120.19 120.32 119.11 124.11 118.63C125.73 118.41 127.06 118.94 127.53 120.4L132.8 136.91V139.32H67.4902V136.91Z" fill={c.apron} stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M67.5 138L73.8509 119.82C74.1609 118.89 75.1509 118.52 76.0909 118.78C78.6609 119.56 82.2309 120.19 86.2709 120.19C89.8409 120.19 91.8909 118.94 93.6209 118.94C95.8509 118.94 97.8409 120.31 99.7209 120.31C101.451 120.31 103.731 118.94 105.411 118.94C107.741 118.94 108.721 120.19 112.821 120.19C116.911 120.19 120.851 119.11 123.951 118.63C125.221 118.41 126.601 118.94 127.021 120.4L132.5 138L100 139L67.5 138Z" fill={c.apronLight} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Apron lines */}
      <path d="M75.6191 127.809L93.9891 128.129" stroke={c.apronLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M75.0508 131.43L93.9908 131.75" stroke={c.apronLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M100.039 120.09V137.73" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Apron bottom folds */}
      <path d="M67.9102 137.729C70.9102 136.699 74.0602 136.219 77.2602 136.219H87.7302C92.4102 136.219 97.3102 137.249 99.7202 138.809H67.9102V137.729Z" fill={c.apron} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M131.64 137.729C128.64 136.699 125.49 136.219 122.29 136.219H111.83C107.14 136.219 102.25 137.249 99.8301 138.809H131.64V137.729Z" fill={c.apron} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === ARMS (paws) === */}
      <path d="M67.3809 103.658C70.6409 110.278 75.4209 118.888 84.1109 121.138C87.9409 122.158 91.7309 120.718 92.8109 118.148C94.0309 115.048 92.0409 110.798 88.7909 106.128C86.6509 102.918 85.7109 100.668 85.5109 97.8281" fill={Array.isArray(c.leg) ?c.leg[0]: (c.leg||c.body) }/>
      <path d="M67.3809 103.658C70.6409 110.278 75.4209 118.888 84.1109 121.138C87.9409 122.158 91.7309 120.718 92.8109 118.148C94.0309 115.048 92.0409 110.798 88.7909 106.128C86.6509 102.918 85.7109 100.668 85.5109 97.8281" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M132.641 103.658C130.071 109.938 124.861 118.098 116.911 120.608C113.071 121.828 109.191 121.088 107.461 118.988C105.231 116.158 106.111 111.598 109.211 107.248C111.731 103.608 113.351 100.618 114.231 97.8281" fill={Array.isArray(c.leg) ?c.leg[1]: (c.leg||c.body) }/>
      <path d="M132.641 103.658C130.071 109.938 124.861 118.098 116.911 120.608C113.071 121.828 109.191 121.088 107.461 118.988C105.231 116.158 106.111 111.598 109.211 107.248C111.731 103.608 113.351 100.618 114.231 97.8281" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Paw pads */}
      <path d="M88.94 108.199C83.72 107.129 77.08 110.7 76 115C78.04 117.35 81.7 120.5 86 120.5C90.3 120.5 92.24 119.1 92.5 116C92.71 113.43 91.5 110.5 88.94 108.199Z" fill={paw(2)}/>
      <path d="M110.5 107.001C115.72 105.931 122.92 110.97 124 115.27C121.96 117.62 118.3 120.5 114 120.5C109 120.5 107.28 118.371 107.02 115.271C106.81 112.701 108.5 109.003 110.5 107.001Z" fill={paw(3)}/>
      {/* Paw lines */}
      <path d="M85.1406 117.121L87 120.5" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M90.6191 115.211L92 118.5" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M113.609 117.121L112 120.5" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M108.72 115.211L107 118" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* === BROOM === */}
      <path d="M142.15 132.218L157.11 120.028C158.43 118.938 160.85 118.938 161.88 120.028C163.1 121.448 163.21 124.168 161.63 125.438L148.73 136.428C146.79 138.128 144.22 138.808 140.28 138.808C138.71 138.808 139.75 135.598 142.15 132.218Z" fill={c.deskDark} stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M142.811 132.988L145.911 136.218" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs xmlns="http://www.w3.org/2000/svg">
<filter id="filter0_f_2229_6777" x="57" y="16" width="84" height="83" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="7.5" result="effect1_foregroundBlur_2229_6777"/>
</filter>
</defs>
    </svg>
  );
};

export default CatSVG;
