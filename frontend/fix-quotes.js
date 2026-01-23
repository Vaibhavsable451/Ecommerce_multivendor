const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

const srcDir = path.join(__dirname, 'src');

walk(srcDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // Regex to find imports where we might have mixed quotes (e.g., 'path")
        // We look for ' followed by letters then " OR " followed by letters then '
        content = content.replace(/import\s+([\s\S]*?)\s+from\s+[']([^'"]+)['"]/g, "import $1 from '$2'");
        content = content.replace(/import\s+([\s\S]*?)\s+from\s+["]([^'"]+)["]/g, "import $1 from '$2'");

        // Specific fix for the messy ones like 'types/userTypes"
        content = content.replace(/from\s+[']([^'"]+)["]/g, "from '$1'");
        content = content.replace(/from\s+["]([^'"]+)[']/g, "from '$1'");

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`FIXED QUOTES: ${filePath}`);
        }
    }
});