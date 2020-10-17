# Classify Script

Classifies bitcoin scripts as a specific tag. Examples: payment, data, twetch, 21e8 or boost.

Create a pull request to add more classifications

## Installation

```bash
npm install @matterpool/classify-script
```

```javascript
const bsv = require('bsv');
const classifyScript = require('@matterpool/classify-script');
const script = new bsv.Script();
classifyScript(script);
```
