const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const metaTags = `
  <meta name="naver-site-verification" content="ee52cf50bd4f8a34251bea1748cec479867ba183" />
  <meta name="google-site-verification" content="trxvl4ZzO6Q-ZUqIMdSYd9vbkKghuCgmqxb-gDeX36o" />
  <meta name="keywords" content="한국여행, Korea travel, K-culture, 맛집, 카페, 명소, 서울여행, 부산여행, 제주여행" />
  <meta property="og:title" content="K컬처MAP - 한국 문화 여행 가이드" />
  <meta property="og:description" content="외국인을 위한 한국 여행 정보 플랫폼" />
  <meta property="og:url" content="https://www.kculture-map.com" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.kculture-map.com" />
`;

html = html.replace('</head>', metaTags + '</head>');
fs.writeFileSync(filePath, html, 'utf8');
console.log('Meta tags injected successfully!');
