function PaymillTokenizer(args) {
  return function(card, amountInCents, cb) {
    var params = {
      number: card.get('number'),
      exp_month: card.get('month'),
      exp_year: card.get('year'),
      cvc: card.get('cvc'),
      amount_int: amountInCents,
      currency: args.currency
    };

    var parseResponse = function(error, response) {
      error ? cb(parseError(error)) : cb(null, response.token);
    };

    paymill.createToken(params, parseResponse);
  };
}

PaymillTokenizer.Exceptions = {
  'internal_server_error': 'Communication with PSP failed',
  'invalid_public_key': 'Invalid Public Key',
  'invalid_payment_data': 'Not permitted for this method of payment, credit card type, currency or country',
  'unknown_error': 'Unknown Error',
  '3ds_cancelled': 'Password Entry of 3-D Secure password was cancelled by the user',
  'field_invalid_card_number': 'Missing or invalid creditcard number',
  'field_invalid_card_exp_year': 'Missing or invalid expiry year',
  'field_invalid_card_exp_month': 'Missing or invalid expiry month',
  'field_invalid_card_exp': 'Card is no longer valid or has expired',
  'field_invalid_card_cvc': 'Invalid checking number',
  'field_invalid_card_holder': 'Invalid cardholder',
  'field_invalid_amount_int': 'Invalid or missing amount for 3-D Secure',
  'field_invalid_currency': 'Invalid or missing currency code for 3-D Secure'
};

function parseError(error) {
  return PaymillTokenizer.Exceptions[error.apierror];
}

module.exports = PaymillTokenizer;