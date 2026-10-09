const fs = require('fs');
let data = fs.readFileSync('src/pages/ExamSimulator.tsx', 'utf8');
data = data.replace(/\\\`/g, '`');
fs.writeFileSync('src/pages/ExamSimulator.tsx', data);
