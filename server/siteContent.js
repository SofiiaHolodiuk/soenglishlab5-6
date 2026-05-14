const fs = require('fs');
const path = require('path');

const SITE_CONTENT_PATH = path.join(__dirname, 'data', 'site-content.json');

function readSiteContent() {
  const raw = fs.readFileSync(SITE_CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

module.exports = { readSiteContent, SITE_CONTENT_PATH };
