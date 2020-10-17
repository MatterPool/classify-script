const isPaymentOut = require('./lib/is-payment-out');
const isDataOut = require('./lib/is-data-out');
const is21e8Out = require('./lib/is-21e8-out');
const isBoostOut = require('./lib/is-boost-out');
const isTwetchOut = require('./lib/is-twetch-out');

const classify = (script) => {
	let tag = '';

	if (isPaymentOut(script)) {
		tag = 'payment';
	} else if (isDataOut(script)) {
		tag = 'data';

		const twetch = isTwetchOut(script);

		if (twetch) {
			tag = twetch;
		}
	} else if (is21e8Out(script)) {
		tag = '21e8';
	} else if (isBoostOut(script)) {
		tag = 'boost';
	}

	return tag;
};

module.exports = classify;
