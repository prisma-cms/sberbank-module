
import Debug from "debug";

const debug = Debug('sberbank-module:request');

// Generate URL-encoded query string
function http_build_query(formdata, numeric_prefix, arg_separator) {
  //
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Legaev Andrey
  // +   improved by: Michael White (http://crestidg.com)

  let key;
  let use_val;
  let use_key;
  let i = 0;
  const tmp_arr = [];

  if (!arg_separator) {
    arg_separator = '&';
  }

  for (key in formdata) {
    use_key = escape(key);
    use_val = escape((formdata[key].toString()));
    use_val = use_val.replace(/%20/g, '+');

    if (numeric_prefix && !isNaN(key)) {
      use_key = numeric_prefix + i;
    }
    tmp_arr[i] = use_key + '=' + use_val;
    i++;
  }

  return tmp_arr.join(arg_separator);
}

const request = async (path, data) => {


  const {

    SBERBANK_ENDPOINT: endpoint,
    // SBERBANK_ENDPOINT,
    SBERBANK_LOGIN: userName,
    SBERBANK_PASSWORD: password,
    SBERBANK_TOKEN: token,
  } = process.env;

  // const endpoint = 'https://3dsec.sberbank.ru';

  if (!endpoint) {
    throw new Error('SBERBANK_ENDPOINT env is empty');
  }

  debug('endpoint', endpoint);

  if (token) {

    debug('Authorization by token', token);

    Object.assign(data, {
      token,
    });
  }
  else if (userName && password) {

    debug('Authorization by userName && password', userName, password);

    Object.assign(data, {
      userName,
      password,
    });
  }
  else {
    throw new Error('SBERBANK_LOGIN, SBERBANK_PASSWORD or SBERBANK_TOKEN environments should be defined');
  }

  const url = `${endpoint}${path}?${http_build_query(data)}`;

  debug('url', url);

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => {

      return response.json();
    });

  return result;
}

export default request;
