var createCookie, formToJSON, getLogin, getLoginSignupSettings, getSettings, getSignup, logout, postLogin, postPut, postSignup, putSettings, readCookie;

createCookie = function(name, value, days) {
  var date, expires;
  if (days) {
    date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + (date.toGMTString());
  } else {
    expires = '';
  }
  return document.cookie = name + "=" + value + expires + "; path=/";
};

readCookie = function(cookieName) {
  var a, b, cookies, i, j, len, n;
  cookies = " " + document.cookie;
  a = cookies.split(';');
  console.log(a);
  for (i = j = 0, len = a.length; j < len; i = ++j) {
    n = a[i];
    b = a[i].split('=');
    console.log(b);
    if (b[0] === (" " + cookieName)) {
      console.log(b[1]);
      return b[1];
    }
  }
};

formToJSON = function(elements) {
  return [].reduce.call(elements, function(data, element) {
    data[element.name] = element.value;
    return data;
  }, {});
};

getLoginSignupSettings = function(event, getTo) {
  event.preventDefault();
  return getTo.then(function(result) {
    console.log(result);
    return $('body').html(result.data);
  })["catch"](function(error) {
    return console.log(error);
  });
};

postPut = function(event, postPutTo) {
  event.preventDefault();
  return postPutTo.then(function(result) {
    console.log(result);
    $('body').html(result.data);
    return createCookie('do-it', result.headers.cookie, 3);
  })["catch"](function(error) {
    return console.log(error);
  });
};

getSignup = function(event) {
  var address;
  address = axios.get('/user/signup');
  return getLoginSignupSettings(event, address);
};

getLogin = function(event) {
  var address;
  address = axios.get('/user/login');
  return getLoginSignupSettings(event, address);
};

getSettings = function(event) {
  var address, cookie;
  cookie = readCookie('do-it');
  address = axios.get("/user/" + cookie);
  return getLoginSignupSettings(event, address);
};

postSignup = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  address = axios.post('/user/signup', data);
  return postPut(event, address);
};

postLogin = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  address = axios.post('/user/login', data);
  return postPut(event, address);
};

putSettings = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.put('/user', data);
  return postPut(event, address);
};

logout = function(event) {
  event.preventDefault();
  return axios["delete"]('/user/logout').then(function(result) {
    console.log(result);
    return $('body').html(result.data);
  })["catch"](function(error) {
    return console.log(error);
  });
};

$(document).ready(function() {
  $('#sign-up').click(getSignup);
  $('#log-in').click(getLogin);
  $('#settings').click(getSettings);
  $('#signup-form').submit(postSignup);
  $('#login-form').submit(postLogin);
  $('#change-form').submit(putSettings);
  return $('#log-out').click(logout);
});
