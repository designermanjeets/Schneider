var dataLogger = {
  mock: function (request, response) {
    var functStr = "angular.module('httpMocker', ['ngMockE2E'])";
    functStr += "\r.run(function($httpBackend) {" +
      "$httpBackend.whenPOST(/datalog/, '" + request + "').respond(" + JSON.stringify(response) + ");"
      + "$httpBackend.whenGET(/.*/).passThrough();"
      + "$httpBackend.whenPOST(/.*/, /.*/).passThrough();"
      + "})";
    var funcTyped = Function(functStr);
    console.log(functStr);
    browser.addMockModule('httpMocker', funcTyped);
  }
};

module.exports = dataLogger;
