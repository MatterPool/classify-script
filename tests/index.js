const Script = require('bsv/lib/script');
const classify = require('../index');

module.exports = (tag, hex) => {
	it(tag, () => {
		const script = new Script(hex);
		const classifiedTag = classify(script);
		expect(classifiedTag).toBe(tag);
	});
}
