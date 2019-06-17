
var passwordInput = element(by.id('inputPassword'));
var loginButton = element(by.id('btnLogin'));


var LoginPage = {
  go: function() {
    browser.get('http://' + browser.baseUrl);
    return browser.waitForAngular();
  },
  login: function (password) {
    if (passwordInput.isPresent()) {
      passwordInput.sendKeys(password);
      loginButton.click();
      browser.sleep(2000);
      browser.waitForAngular();
    }
  }
};

module.exports = LoginPage;

