const Opcode = require('bsv/lib/opcode');

const isRunOut = (script) => {
	if (script.chunks[0].opcodenum === Opcode.OP_0 &&
		script.chunks[1].opcodenum === Opcode.OP_RETURN &&
		script.chunks[2].buf.toString('utf8') === 'run') {
		return script.chunks[4].buf ? script.chunks[4].buf.toString('utf8') : 'run';
	}
	return false;
};

module.exports = isRunOut;
