const Opcode = require('bsv/lib/opcode');

const is21e8Out = script => {
	return !!(
		script.chunks.length === 12 &&
		script.chunks[0].buf &&
		script.chunks[0].buf.length === 32 &&
		script.chunks[1].buf &&
		script.chunks[1].buf.length >= 1 &&
		script.chunks[2].opcodenum === Opcode.OP_SIZE &&
		script.chunks[3].opcodenum === Opcode.OP_4 &&
		script.chunks[4].opcodenum === Opcode.OP_PICK &&
		script.chunks[5].opcodenum === Opcode.OP_SHA256 &&
		script.chunks[6].opcodenum === Opcode.OP_SWAP &&
		script.chunks[7].opcodenum === Opcode.OP_SPLIT &&
		script.chunks[8].opcodenum === Opcode.OP_DROP &&
		script.chunks[9].opcodenum === Opcode.OP_EQUALVERIFY &&
		script.chunks[10].opcodenum === Opcode.OP_DROP &&
		script.chunks[11].opcodenum === Opcode.OP_CHECKSIG
	);
};

module.exports = is21e8Out;
