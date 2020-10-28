const Opcode = require('bsv/lib/opcode');

const ensure_positive = () => {
	return [Buffer.from('00', 'hex'), Opcode.OP_CAT, Opcode.OP_BIN2NUM];
};

const expand_target = () => {
	return [
		Opcode.OP_SIZE,
		Opcode.OP_4,
		Opcode.OP_EQUALVERIFY,
		Opcode.OP_3,
		Opcode.OP_SPLIT,
		Opcode.OP_DUP,
		Opcode.OP_BIN2NUM,
		Opcode.OP_3,
		Buffer.from('21', 'hex'), // actually 33, but in hex
		Opcode.OP_WITHIN,
		Opcode.OP_VERIFY,
		Opcode.OP_TOALTSTACK,
		Opcode.OP_DUP,
		Opcode.OP_BIN2NUM,
		Opcode.OP_0,
		Opcode.OP_GREATERTHAN,
		Opcode.OP_VERIFY,
		Buffer.from('0000000000000000000000000000000000000000000000000000000000', 'hex'),
		Opcode.OP_CAT,
		Opcode.OP_FROMALTSTACK,
		Opcode.OP_3,
		Opcode.OP_SUB,
		Opcode.OP_8,
		Opcode.OP_MUL,
		Opcode.OP_RSHIFT,
	];
};

const scriptOperations = () => {
	return [
		// CAT SWAP
		Opcode.OP_CAT,
		Opcode.OP_SWAP,

		// {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey hash to alt stack. A copy remains on the stack.
		Opcode.OP_5,
		Opcode.OP_ROLL,
		Opcode.OP_DUP,
		Opcode.OP_TOALTSTACK,
		Opcode.OP_CAT,

		// {2} PICK TOALTSTACK                         // copy target and push to altstack.
		Opcode.OP_2,
		Opcode.OP_PICK,
		Opcode.OP_TOALTSTACK,

		// {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_1
		Opcode.OP_5,
		Opcode.OP_ROLL,
		Opcode.OP_SIZE,
		Opcode.OP_4,
		Opcode.OP_EQUALVERIFY,
		Opcode.OP_CAT,

		// {5} ROLL SIZE {8} EQUALVERIFY CAT          // check size of extra_nonce_2
		Opcode.OP_5,
		Opcode.OP_ROLL,
		Opcode.OP_SIZE,
		Opcode.OP_8,
		Opcode.OP_EQUALVERIFY,
		Opcode.OP_CAT,

		// SWAP CAT HASH256                           // create metadata string and hash it.
		Opcode.OP_SWAP,
		Opcode.OP_CAT,
		Opcode.OP_HASH256,

		// SWAP TOALTSTACK CAT CAT                    // target to altstack.
		Opcode.OP_SWAP,
		Opcode.OP_TOALTSTACK,
		Opcode.OP_CAT,
		Opcode.OP_CAT,

		// SWAP SIZE {4} EQUALVERIFY CAT              // check size of timestamp.
		Opcode.OP_SWAP,
		Opcode.OP_SIZE,
		Opcode.OP_4,
		Opcode.OP_EQUALVERIFY,
		Opcode.OP_CAT,

		// FROMALTSTACK CAT                           // attach target
		Opcode.OP_FROMALTSTACK,
		Opcode.OP_CAT,

		// SWAP SIZE {4} EQUALVERIFY CAT             // check size of nonce. Boost POW string is constructed.
		Opcode.OP_SWAP,
		Opcode.OP_SIZE,
		Opcode.OP_4,
		Opcode.OP_EQUALVERIFY,
		Opcode.OP_CAT,

		// Take hash of work string and ensure that it is positive and minimally encoded.
		Opcode.OP_HASH256,
		...ensure_positive(),

		Opcode.OP_FROMALTSTACK,
		...expand_target(),
		...ensure_positive(),

		// check that the hash of the Boost POW string is less than the target
		Opcode.OP_LESSTHAN,
		Opcode.OP_VERIFY,

		// check that the given address matches the pubkey and check signature.
		// DUP HASH160 FROMALTSTACK EQUALVERIFY CHECKSIG
		Opcode.OP_DUP,
		Opcode.OP_HASH160,
		Opcode.OP_FROMALTSTACK,
		Opcode.OP_EQUALVERIFY,
		Opcode.OP_CHECKSIG,
	];
};

const remainingOperationsMatchExactly = (remainingChunks, start) => {
	let i = 0;
	const expectedOps = scriptOperations();
	if (expectedOps.length !== remainingChunks.length - 8) {
		console.log('length does not match', expectedOps[i].length, remainingChunks.length);
		return false;
	}
	while (i < remainingChunks.length - 8) {
		// console.log(' i < ', remainingChunks.length, expectedOps[i], remainingChunks[start + i]);
		if (
			// If it's a buffer, then ensure the value matches expect length
			(remainingChunks[start + i].buf &&
				remainingChunks[start + i].len === expectedOps[i].length) ||
			(remainingChunks[start + i].buf === undefined &&
				expectedOps[i] === remainingChunks[start + i].opcodenum)
		) {
			i++;
		} else {
			return false;
		}
	}
	return true;
};

const isBoostOut = (script) => {
	return !!(
		script.chunks[0].buf &&
		script.chunks[0].buf.toString('utf8') === 'boostpow' &&
		script.chunks[1].opcodenum === Opcode.OP_DROP &&
		script.chunks[2].buf &&
		script.chunks[2].opcodenum === 4 &&
		script.chunks[3].buf &&
		script.chunks[3].len === 32 &&
		script.chunks[4].buf &&
		script.chunks[4].len === 4 &&
		script.chunks[5].buf &&
		script.chunks[5].len === 20 &&
		script.chunks[6].buf &&
		script.chunks[6].len === 4 &&
		script.chunks[7].buf &&
		remainingOperationsMatchExactly(script.chunks, 8)
	);
};

module.exports = isBoostOut;
