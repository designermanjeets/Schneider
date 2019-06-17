var info;
var fileCounter = 1;
var powerflow = new Powerflow("../dist/");
powerflow.onChargerClick(function(chargers) {
  console.log(chargers);
});

powerflow.onInverterClick(function(inverters) {
  console.log(inverters);
});

powerflow.onGridTieInverterClick(function(gts) {
  console.log(gts);
});

powerflow.onInverterChargerClick(function(inverterChargers) {
  console.log(inverterChargers);
});
powerflow.onBattmonClick(function(battmonId) {
  console.log(battmonId);
});

powerflow.onGeneratorClick(function(generators) {
  console.log(generators);
});

setTimeout(function() {
  var pfJson = getJson(fileCounter);
  powerflow.update(pfJson);
  document.getElementById("description").innerHTML = pfJson.description;
  document.getElementById("fileName").innerHTML = fileCounter + ".json";
}, 300);

document.getElementById("previous").onclick = function() {
  if (fileCounter !== 1) {
    fileCounter--;
    var pfJson = getJson(fileCounter);
    powerflow.update(pfJson);
    document.getElementById("description").innerHTML = pfJson.description;
    document.getElementById("fileName").innerHTML = fileCounter + ".json";
  }
};

document.getElementById("next").onclick = function() {
  fileCounter++;
  try {
    var pfJson = getJson(fileCounter);
    powerflow.update(pfJson);
    document.getElementById("description").innerHTML = pfJson.description;
    document.getElementById("fileName").innerHTML = fileCounter + ".json";
  } catch (err) {
    fileCounter--;
  }
};


function getJson(fileName) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", 'json/' + fileName + '.json', false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
