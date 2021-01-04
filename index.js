const isPaymentOut = require('./lib/is-payment-out');
const isDataOut = require('./lib/is-data-out');
const is21e8Out = require('./lib/is-21e8-out');
const isBoostOut = require('./lib/is-boost-out');
const isTwetchOut = require('./lib/is-twetch-out');
const isRunOut = require('./lib/is-run-out');
const isArkOut = require('./lib/is-ark-out');
const isEtchedOut = require('./lib/is-etched-out');

const classify = (script) => {
	let tag = '';

	if (isPaymentOut(script)) {
		tag = 'payment';
	} else if (isDataOut(script)) {
		tag = 'data';

		const twetch = isTwetchOut(script);
		if (twetch) {
			tag = twetch;
		} else if (isRunOut(script)) {
			tag = isRunOut(script);
		} else if (isArkOut(script)) {
			tag = 'ark.page';
		} else if (isEtchedOut(script)) {
			tag = 'etched.page';
		}
	} else if (is21e8Out(script)) {
		tag = '21e8';
	} else if (isBoostOut(script)) {
		tag = 'boost';
	}

	return tag;
};

module.exports = classify;
