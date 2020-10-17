const isPaymentOut = (script) => {
	return script.isPublicKeyHashOut();
};

module.exports = isPaymentOut;
