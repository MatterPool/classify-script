const twetchAbi = require('./twetch-abi');
const Transaction = require('bsv/lib/transaction');
const BSVABI = require('@twetch/bsvabi/dist/bsvabi.min.js');

const isTwetchOut = (script) => {
	const actions = Object.keys(twetchAbi.actions);
	let instance;
	const tx = new Transaction();
	tx.addOutput(new Transaction.Output({ script: script.toString(), satoshis: 0 }));
	const rawtx = tx.toString();

	for (let action of actions) {
		try {
			instance = new BSVABI(twetchAbi).action(action).fromTx(rawtx);
			break;
		} catch (e) {}
	}

	if (instance && instance.args && instance.args[1] && instance.args[1].includes('$osg')) {
		return 'retrotwetch';
	}

	return (
		!!instance && instance.actionName && 'Twetch ' + instance.actionName.split('/')[1].split('@')[0]
	);
};

module.exports = isTwetchOut;
