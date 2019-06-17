"use strict";

//This service is used for retreive the energy chart data
angular.module('conext_gateway.setup').factory('pcPDFGeneratorService', [
  'moment', '$filter',
  function(moment, $filter) {

    var service = {
      exportPDF: exportPDF
    }
    return service;

    function exportPDF(serialnumber, date, gridcodes, additionalInfo, buildVersion) {

      var lioLogo = $("#lioLogo");
      var deviceName = $('#header_device_name')[0].innerText;


      var pdf = new jsPDF('p', 'pt', 'letter');

      var centeredText = function(text, y) {
        var textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, y, text);
      }

      var rightAlginText = function(text, y) {
        var textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth - 40);
        pdf.text(textOffset, y, text);
      }

      var pdfheight = pdf.internal.pageSize.height;
      var pdfWidth = pdf.internal.pageSize.width;

      html2canvas(lioLogo, {
        onrendered: function(canvas) {
          var addHeader = function() {
            pdf.setLineWidth(30);
            pdf.setDrawColor(61, 205, 88);
            pdf.line(0, 75, pdfWidth, 75);
            pdf.addImage(canvas, 'PNG', pdfWidth - 167, 10);
            pdf.setTextColor(61, 205, 88);
            pdf.text("Context Gateway", 20, 30);
            pdf.setTextColor(159, 160, 164);
            pdf.setFontSize(12);
            pdf.text(deviceName, 20, 50);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(14);
            centeredText("Grid Codes", 30);
            centeredText("XW Pro - " + serialnumber, 50);
            pdf.setTextColor(255, 255, 255);
            pdf.text(moment(date).format('YYYY/MM/DD'), pdfWidth - 100, 80);
            pdf.text($filter('translate')('xanbus.grid_codes.build') + ": " + buildVersion, 40, 80);
            pdf.setTextColor(0, 0, 0);
          };
          addHeader();
          var y = 120;
          if (additionalInfo !== undefined) {
            y = needsPageBreak(y + 20, pdfheight, pdf, addHeader);
            pdf.setFontSize(14);
            centeredText($filter('translate')('xanbus.grid_codes.additionalInfo'), y);
            pdf.setFontSize(12);
            var sentences = additionalInfo.split('\n');
            for (var sentence in sentences) {
              if (sentences.hasOwnProperty(sentence)) {
                y = needsPageBreak(y + 20, pdfheight, pdf, addHeader);
                pdf.text(sentences[sentence], 40, y);
              }
            }
            y = needsPageBreak(y + 20, pdfheight, pdf);
            drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          }

          pdf.setFontSize(14);
          y = needsPageBreak(y + 20, pdfheight, pdf, addHeader);
          centeredText($filter('translate')('xanbus.grid_codes.region'), y);
          y = needsPageBreak(y + 20, pdfheight, pdf, addHeader);
          pdf.setFontSize(12);
          pdf.text(getRegion(gridcodes.region.value), 40, y);
          y = needsPageBreak(y + 20, pdfheight, pdf);
          drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'qv', gridcodes.qv, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'pw', gridcodes.pw, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'lfrt', gridcodes.lfrt, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'hfrt', gridcodes.hfrt, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'lvrt', gridcodes.lvrt, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'hvrt', gridcodes.hvrt, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'pf', gridcodes.pf, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'ss', gridcodes.ss, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          y = drawCurve(pdf, y, 'rr', gridcodes.rr, pdfheight, addHeader, centeredText, rightAlginText);
          y = drawLineBreak(pdf, y, pdfWidth, pdfheight, addHeader);
          y += 20;
          drawPowerFactor(pdf, y, pdfWidth, pdfheight, gridcodes.powerfactor, addHeader, centeredText, rightAlginText);

          pdf.save('grid_codes.pdf');
        }
      });
    }

    function getPFType(value) {
      var pfType = "";
      if (value === 1) {
        pfType = $filter('translate')('xanbus.grid_codes.unity');
      } else {
        pfType = (value > 0) ? $filter('translate')('xanbus.grid_codes.leading') : $filter('translate')('xanbus.grid_codes.lagging');
      }
      return pfType;
    }

    function drawPowerFactor(pdf, y, width, pdfheight, curvedata, addHeader, centeredText, rightAlginText) {
      y = needsPageBreak(y, pdfheight, pdf, addHeader);
      pdf.setFontSize(14);
      centeredText($filter('translate')('xanbus.grid_codes.powerfactor'), y);
      y = needsPageBreak(y + 20, pdfheight, pdf, addHeader);
      pdf.setFontSize(12);
      var text = (curvedata.enabled === 1) ? $filter('translate')('xanbus.grid_codes.enabled') : $filter('translate')('xanbus.grid_codes.disabled');
      if (curvedata.enabled === 1) {
        pdf.setTextColor(61, 205, 88);
      } else {
        pdf.setTextColor(220, 10, 10);
      }
      rightAlginText(text, y);
      pdf.setTextColor(0, 0, 0);
      y = needsPageBreak(y + 20, pdfheight, pdf, addHeader);
      pdf.setFontSize(12);
      pdf.text("" + curvedata.value + " " + getPFType(curvedata.value), 40, y);
    }

    function drawLineBreak(pdf, y, width, pdfheight, addHeader) {
      y = needsPageBreak(y, pdfheight, pdf, addHeader);
      pdf.setLineWidth(1);
      pdf.setDrawColor(159, 160, 164);
      pdf.line(0, y, width, y);
      return y;
    }

    function needsPageBreak(y, pdfheight, pdf, addHeader) {
      if (y > pdfheight) {
        pdf.addPage();
        addHeader();
        return 140;
      }
      return y;
    }

    function getRegion(region_code) {
      var region = "";
      switch (region_code) {
        case '1':
          region = $filter('translate')('xanbus.grid_codes.california');
          break;
        case '2':
          region = $filter('translate')('xanbus.grid_codes.ieee1547');
          break;
        case '3':
          region = $filter('translate')('xanbus.grid_codes.custom');
          break;
        default:
      }
      return region;
    }

    function drawCurve(pdf, y, curve, curvedata, pagebreakinfo, addHeader, centeredText, rightAlginText) {
      var curveInfo = getCurveInfo(curve);
      var index;
      pdf.setFontSize(14);
      y = needsPageBreak(y, pagebreakinfo, pdf, addHeader);
      centeredText(curveInfo.title, y);

      if (curve === 'ss' || curve === 'rr') {
        y = needsPageBreak(y + 20, pagebreakinfo, pdf, addHeader);
        pdf.setFontSize(12);
        pdf.text($filter('translate')('xanbus.grid_codes.slope') + ": " + curvedata.slope.value, 40, y);
      }
      if (curvedata.hasOwnProperty('enabled')) {
        y = needsPageBreak(y + 20, pagebreakinfo, pdf, addHeader);
        pdf.setFontSize(12);
        var text = (curvedata.enabled === 1) ? $filter('translate')('xanbus.grid_codes.enabled') : $filter('translate')('xanbus.grid_codes.disabled');

        if (curvedata.enabled === 1) {
          pdf.setTextColor(61, 205, 88);
        } else {
          pdf.setTextColor(220, 10, 10);
        }

        rightAlginText(text, y);
        pdf.setTextColor(0, 0, 0);
      }
      y = needsPageBreak(y + 20, pagebreakinfo, pdf, addHeader);
      pdf.setFontSize(12);
      pdf.text(curveInfo.x, 110, y);
      pdf.text(curveInfo.y, 260, y);
      for (index = 0; index < curvedata.data.length; index++) {
        y = needsPageBreak(y + 20, pagebreakinfo, pdf, addHeader);
        pdf.setFontSize(12);
        pdf.text($filter('translate')('xanbus.grid_codes.point') + (index + 1), 40, y);
        pdf.text("" + curvedata.data[index].x, 110, y);
        pdf.text("" + curvedata.data[index].y, 260, y);
      }

      return y + 20;
    }

    function getCurveInfo(curve) {
      var result = {};

      switch (curve) {
        case 'qv':
          result.title = $filter('translate')('xanbus.grid_codes.qv');
          result.x = $filter('translate')('xanbus.grid_codes.qv-x');
          result.y = $filter('translate')('xanbus.grid_codes.qv-y');
          break;
        case 'pw':
          result.title = $filter('translate')('xanbus.grid_codes.pw');
          result.x = $filter('translate')('xanbus.grid_codes.pw-x');
          result.y = $filter('translate')('xanbus.grid_codes.pw-y');
          break;
        case 'lfrt':
          result.title = $filter('translate')('xanbus.grid_codes.lfrt');
          result.x = $filter('translate')('xanbus.grid_codes.frt-x');
          result.y = $filter('translate')('xanbus.grid_codes.frt-y');
          break;
        case 'hfrt':
          result.title = $filter('translate')('xanbus.grid_codes.hfrt');
          result.x = $filter('translate')('xanbus.grid_codes.frt-x');
          result.y = $filter('translate')('xanbus.grid_codes.frt-y');
          break;
        case 'lvrt':
          result.title = $filter('translate')('xanbus.grid_codes.lvrt');
          result.x = $filter('translate')('xanbus.grid_codes.vrt-x');
          result.y = $filter('translate')('xanbus.grid_codes.vrt-y');
          break;
        case 'hvrt':
          result.title = $filter('translate')('xanbus.grid_codes.hvrt');
          result.x = $filter('translate')('xanbus.grid_codes.vrt-x');
          result.y = $filter('translate')('xanbus.grid_codes.vrt-y');
          break;
        case 'pf':
          result.title = $filter('translate')('xanbus.grid_codes.pf');
          result.x = $filter('translate')('xanbus.grid_codes.pf-x');
          result.y = $filter('translate')('xanbus.grid_codes.pf-y');
          break;
        case 'ss':
          result.title = $filter('translate')('xanbus.grid_codes.ss');
          result.x = $filter('translate')('xanbus.grid_codes.ss-x');
          result.y = $filter('translate')('xanbus.grid_codes.ss-y');
          break;
        case 'rr':
          result.title = $filter('translate')('xanbus.grid_codes.rr');
          result.x = $filter('translate')('xanbus.grid_codes.rr-x');
          result.y = $filter('translate')('xanbus.grid_codes.rr-y');
          break;
        default:
      }
      return result;
    }
  }
]);
