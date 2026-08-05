const fs = require('fs');
let html = fs.readFileSync('src/components/views/LandingPageTemp.html', 'utf8');

// Extract the body content between <body> and </body>
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log('No body found');
  process.exit(1);
}
let body = bodyMatch[1];

// Remove Alpine.js x- attributes
body = body.replace(/x-data="[^"]*"/g, '');
body = body.replace(/x-show="[^"]*"/g, '');
body = body.replace(/x-cloak/g, '');
body = body.replace(/@click="[^"]*"/g, '');
body = body.replace(/x-transition\.opacity\.duration\.\d+ms/g, '');

// Convert to JSX
body = body.replace(/class=/g, 'className=');
body = body.replace(/stroke-width=/g, 'strokeWidth=');
body = body.replace(/stroke-linecap=/g, 'strokeLinecap=');
body = body.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
body = body.replace(/stroke-dasharray=/g, 'strokeDasharray=');
body = body.replace(/fill-rule=/g, 'fillRule=');
body = body.replace(/clip-rule=/g, 'clipRule=');
body = body.replace(/style="([^"]*)"/g, (match, styleStr) => {
  const props = styleStr.split(';').filter(Boolean).map(s => {
    const [k, v] = s.split(':').map(x => x.trim());
    if(!k) return '';
    const camelK = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
    return `${camelK}: '${v}'`;
  }).filter(Boolean).join(', ');
  return `style={{${props}}}`;
});

// Fix unclosed tags for JSX (img, input, hr, br, path, circle, rect, line, use)
body = body.replace(/<(img|input|hr|br|path|circle|rect|line|use|symbol|defs)([^>]*?)(?<!\/)>/g, '<$1$2 />');

const reactCode = `import React from 'react';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="bg-canvas text-ink antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      ${body}
    </div>
  );
};`;

fs.writeFileSync('src/components/views/LandingPage.tsx', reactCode);
console.log('Done!');
