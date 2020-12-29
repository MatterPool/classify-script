const Opcode = require('bsv/lib/opcode')

const isEtchedOut = script => {
	try {
		let index = 0
		if (script.chunks[index].opcodenum === Opcode.OP_0) index++
		if (script.chunks[index++].opcodenum !== Opcode.OP_RETURN) throw new Error('no opreturn')
		for (index; index < script.chunks.length; index++) {
			const chunk = script.chunks[index]
			if (chunk.buf.toString() === '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5') {
				for (index; index < script.chunks.length; index++) {
					const chunk = script.chunks[index]
					if (chunk.buf && chunk.buf.toString() === '|') throw new Error('break')
					if (
						chunk.buf &&
						chunk.buf.toString() === 'source' &&
						script.chunks[index + 1].buf.toString() === 'https://etched.page'
					) {
						return true
					}
				}
			}
		}
	} catch (err) {}
	return false
}

module.exports = isEtchedOut
