const fs = require('fs');
const path = require('path');

const filePath = path.join('/Users/amanpandey/AmanwedsSanjana', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace absolute paths to relative paths
content = content.replace(/src="\/assets\//g, 'src="assets/');
content = content.replace(/href="\/assets\//g, 'href="assets/');
content = content.replace(/url\("\/assets\//g, 'url("assets/');
content = content.replace(/url\(\'\/assets\//g, "url('assets/");
content = content.replace(/url\(\/assets\//g, 'url(assets/');
content = content.replace(/src="\/audio\//g, 'src="audio/');
content = content.replace(/href="\/audio\//g, 'href="audio/');
content = content.replace(/src="\/~flock\.js"/g, 'src="flock.js"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed absolute paths to relative paths in index.html!');
