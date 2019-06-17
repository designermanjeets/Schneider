function SVGService(path) {
  var svgLoadService = new SVGLoadService();
  var xwImageService = new XWImageService();
  var cswImageService = new CSWImageService();
  var battmonImageService = new BattmonImageService();
  var agsImageService = new AGSImageService();

  this.drawAssociationItems = qsDrawAssociationItems;
  this.drawDevices = qsDrawDevices;
  document.getElementById('powerflow').innerHTML = svgLoadService.getPowerflow();
  var snap = new Snap('#svg_powerflow');
  var coordinates = {
    x: 79,
    y: 665
  };

  function qsDrawAssociationItems(items) {
    for (var index = 0; index < items.length; index++) {
      var block = snap.rect(coordinates.x, coordinates.y, 50, 50);
      block.attr({
        fill: "#CBCBCB",
        stroke: "#000",
        strokeWidth: 1
      });

      var text = snap.text(0, coordinates.y + 35, items[index].name);
      text.attr({
        'font-size': 20
      });
      var textWidth = text.node.clientWidth + 10;
      block.attr({
        width: textWidth
      });

      text.attr({
        'x': coordinates.x + 5
      });
      coordinates.x = coordinates.x + textWidth + 10;
    }
  }

  function qsDrawDevices(devices) {
    var x = 75;
    var group;
    var f;

    var move = function(dx, dy, x, y, obj) {
      this.transform('T' + x + ',' + y);
    }

    var start = function() {
      // this.data('origTransform', this.transform().local );
    }
    var stop = function() {

    }


    for (var index = 0; index < devices.length; index++) {
      switch (devices[index].name) {
        case 'XW':
          f = Snap.parse(xwImageService.getImage());
          f.select('g').transform('T' + x + ',0');
          f.select('g').drag(move, start, stop);
          snap.append(f);
          x = x + 85;
          break;
        case 'CSW':
          f = Snap.parse(cswImageService.getImage());
          f.select('g').transform('T' + x + ',0');
          f.select('g').drag(move, start, stop);
          snap.append(f);
          x = x + 88;
          break;
        case 'AGS':
          f = Snap.parse(agsImageService.getImage());
          f.select('g').transform('T' + x + ',0');
          f.select('g').drag(move, start, stop);
          snap.append(f);
          x = x + 85;
          break;
        case 'BATTMON':
          f = Snap.parse(battmonImageService.getImage());
          f.select('g').transform('T' + x + ',0');
          f.select('g').drag(move, start, stop);
          snap.append(f);
          x = x + 85;
          break;
        default:
      }
    }

  }
}
