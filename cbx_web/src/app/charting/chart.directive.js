"use strict";

//This directive is used to pass data to the chartjs object
angular.module('conext_gateway.charting').directive("chart", ["$timeout", "$compile", "csvService",
  function($timeout, $compile, csvService) {
    var link = function($scope, element, attributes) {
      var chart;
      var scopeVariableName = attributes.value ? attributes.value : 'myChart';
      $scope.chartId = scopeVariableName;
      chart = null;

      $scope.resetZoom = function() {
        if (chart) {
          chart.resetZoom();
        }
      };

      $scope.exportCSV = function() {
        var output = [];
        var labels = ['Date'];
        for (var label in $scope.labels) {
          if ($scope.labels.hasOwnProperty(label)) {
            labels.push($scope.labels[label]);
          }
        }

        for (var index in chart.config.data.labels) {
          if (chart.config.data.labels.hasOwnProperty(index)) {
            var temp = [];
            temp[0] = chart.config.data.labels[index];
            for (var dataset_index = 0; dataset_index < chart.config.data.datasets.length; dataset_index++) {
              temp[dataset_index + 1] = chart.config.data.datasets[dataset_index].data[index];
            }
            output.push(temp);
          }
        }
        csvService.saveCsv('chart_data.csv', output, {
          header: labels,
        });
      };

      $scope.exportPDF = function() {
          exportLegendPDF();
      };

      function exportLegendPDF() {
        var chartElement = $('#myChart');
        var legend = $("#legend");
        var lioLogo = $("#lioLogo");
        var deviceName = $('#header_device_name')[0].innerText;
        var reportPageHeight = chartElement.innerHeight() + legend.innerHeight() + 40;
        var reportPageWidth = chartElement.innerWidth() + 40;
        var pdfCanvas = $('<canvas />').attr({
          id: "canvaspdf",
          width: reportPageWidth,
          height: reportPageHeight
        });
        //var pdfctx = $(pdfCanvas)[0].getContext('2d');

        html2canvas(legend, {
          onrendered: function(canvas) {
            //pdfctx.drawImage(canvas, 20, chartElement.innerHeight() + 40, legend.innerWidth(), legend.innerHeight());
            //pdfctx.drawImage(chartElement[0], 20, 20, chartElement.innerWidth(), chartElement.innerHeight());
            var pdf = new jsPDF('p', 'pt', 'letter');
            var pdfWidth = pdf.internal.pageSize.width;

            var centeredText = function(text, y) {
              var textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
              var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
              pdf.text(textOffset, y, text);
            }
            pdf.setLineWidth(30);
            pdf.setDrawColor(61, 205, 88);
            pdf.line(0, 75, pdfWidth, 75);
            var height = (pdfWidth / chartElement[0].width) * chartElement[0].height;
            pdf.addImage(chartElement[0], 'PNG', 20, 140, pdfWidth - 40, height - 40);
            pdf.addImage(canvas, 'PNG', 20, 120 + height);
            html2canvas(lioLogo, {
              onrendered: function(canvas) {
                pdf.addImage(canvas, 'PNG', pdfWidth - 167, 10);
                pdf.setTextColor(61, 205, 88);
                pdf.text("Context Gateway", 20, 30);
                pdf.setTextColor(159, 160, 164);
                pdf.setFontSize(12);
                pdf.text(deviceName, 20, 50);
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(14);
                centeredText($scope.title, 110);
                centeredText($scope.date, 130);
                pdf.save('chart.pdf');
              }
            });
          }
        });
      }

      $scope.exportImage = function() {
          exportLegendImage();
      };

      function exportLegendImage() {
        var chartElement = $('#myChart');
        var legend = $("#legend");
        var reportPageHeight = chartElement.innerHeight() + legend.innerHeight() + 180;
        var reportPageWidth = chartElement.innerWidth() + 40;
        var pdfCanvas = $('<canvas />').attr({
          id: "canvaspdf",
          width: reportPageWidth,
          height: reportPageHeight
        });
        var pdfctx = $(pdfCanvas)[0].getContext('2d');
        pdfctx.font = "20px Arial";
        pdfctx.fillStyle = "#fff";
        pdfctx.rect(0, 0, reportPageWidth, reportPageHeight);
        pdfctx.fill();

        html2canvas(legend, {
          onrendered: function(canvas) {
            pdfctx.textAlign = "center";
            pdfctx.fillStyle = "#0f0f0f";
            pdfctx.fillText($scope.title, reportPageWidth / 2, 80);
            pdfctx.fillText($scope.date, reportPageWidth / 2, 110);
            pdfctx.drawImage(chartElement[0], 20, 120, chartElement.innerWidth(), chartElement.innerHeight());
            pdfctx.drawImage(canvas, 20, chartElement.innerHeight() + 160, legend.innerWidth(), legend.innerHeight());
            var link = $("#imageExportButton")[0];
            link.href = $(pdfCanvas)[0].toDataURL();
            link.download = 'chart.png';
            link.click();
          }
        });
      }

      $scope.isZoomHidden = function() {
        return !$scope[scopeVariableName] || !$scope[scopeVariableName].options || !$scope[scopeVariableName].options.zoom;
      };

      $scope.$watch(scopeVariableName, function(value) {
        $scope.$parent.updateChart = function() {
          if (chart) {
            chart.update();
          }
        };

        if (!chart && value) {
          var elementId = value.type === 'doughnut' ? scopeVariableName + '_doughnut' : scopeVariableName;
          var ctx = document.getElementById(elementId).getContext('2d');
          chart = new Chart(ctx, value);
        }
        if (value) {
          chart.config.data.labels = value.data.labels;
          chart.config.data.datasets = value.data.datasets;
          chart.config.type = value.type;
          $scope.type = value.type;
          $scope.title = value.title;
          $scope.date = value.date;
          $scope.labels = value.labels;
          if (value.hideExport) {
            $scope.hideExport = true;
          }
          copyProperties(chart.config.options, value.options);
          copyProperties(chart.options, value.options);
        }
        if (chart) {
          chart.update();
        }
      });
    };

    function copyProperties(oldObj, newObj) {
      for (var property in newObj) {
        if (newObj.hasOwnProperty(property)) {
          oldObj[property] = newObj[property];
        }
      }
    }


    return {
      templateUrl: "app/charting/chart.html",
      restrict: "E",
      replace: true,
      link: link
    };
  }
]);
