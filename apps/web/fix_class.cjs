const fs = require('fs');
const file = 'src/components/views/LandingPage.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/:className="[^"]*"/g, '');
code = code.replace(/:class="[^"]*"/g, '');
fs.writeFileSync(file, code);
console.log('Fixed classes');
