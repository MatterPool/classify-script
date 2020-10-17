const isPaymentOut = require('./is-payment-out');
const isDataOut = require('./is-data-out');
const is21e8Out = require('./is-21e8-out');
const isBoostOut = require('./is-boost-out');

const classify = script => {
  let tag = '';

  if (isPaymentOut(script)) {
    tag = 'payment';
  } else if (isDataOut(script)) {
    tag = 'data';
  } else if (is21e8Out(script)) {
    tag = '21e8';
  } else if (isBoostOut(script)) {
    tag = 'boost';
  }

  return tag;
};
