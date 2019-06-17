describe("Powerflow callback test", function() {
  var powerflow = new Powerflow();

  it("Charger Click callback", function() {
    var clicked = false;
    powerflow.onChargerClick(
      function() {
        clicked = true;
      }
    );
    powerflow.chargerClick();

    expect(clicked).toBe(true);
  });

  it("Inverter Click callback", function() {
    var clicked = false;
    powerflow.onInverterClick(
      function() {
        clicked = true;
      }
    );
    powerflow.inverterClick();

    expect(clicked).toBe(true);
  });

  it("Grid Tie Inverter Click callback", function() {
    var clicked = false;
    powerflow.onGridTieInverterClick(
      function() {
        clicked = true;
      }
    )
    powerflow.gridTieInverterClick();

    expect(clicked).toBe(true);
  });

  it("Inverter Charger Click callback", function() {
    var clicked = false;
    powerflow.onInverterChargerClick(
      function() {
        clicked = true;
      }
    )
    powerflow.inverterChargerClick();

    expect(clicked).toBe(true);
  });

  it("Battmon Click callback", function() {
    var clicked = false;
    powerflow.onBattmonClick(
      function() {
        clicked = true;
      }
    )
    powerflow.battmonClick();

    expect(clicked).toBe(true);
  });
});
