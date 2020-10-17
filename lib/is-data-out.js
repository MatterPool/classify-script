const isDataOut = (script) => {
	return script.isDataOut() || script.isSafeDataOut();
};

module.exports = isDataOut;
