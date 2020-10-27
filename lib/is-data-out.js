const Opcode = require('bsv/lib/opcode');

const isDataOut = (script) => {
	return !!(
		(script.chunks[0].opcodenum === Opcode.OP_0 &&
			script.chunks[1].opcodenum === Opcode.OP_RETURN) ||
		script.chunks[0].opcodenum === Opcode.OP_RETURN
	);
};

module.exports = isDataOut;
