#!/usr/bin/env node
// .claude/hooks/statusline.js

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const remaining = data.context_window?.remaining_percentage;

    const path = require('path');
    const dirname = path.basename(dir);

    let ctx = '';
    if (remaining != null) {
      ctx = ` │ ${Math.round(remaining)}% left`;
    }

    process.stdout.write(`\x1b[2m${model}\x1b[0m │ \x1b[36m${dirname}\x1b[0m${ctx}`);
  } catch (e) {
    // Silent fail
  }
});