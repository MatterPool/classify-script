const Opcode = require('bsv/lib/opcode');

const isRunOut = (script) => {
	return !!(
		script.chunks[0].opcodenum === Opcode.OP_0 &&
		script.chunks[1].opcodenum === Opcode.OP_RETURN &&
		script.chunks[2].buf.toString('utf8') === 'run'
	);
};

module.exports = isRunOut;
