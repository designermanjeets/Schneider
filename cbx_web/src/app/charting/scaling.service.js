"use strict";

angular.module('conext_gateway.charting').factory('scalingService', [
  function() {

    var service = {
      setScale: setScale,
      setMin: setMin,
      setMax: setMax,
      setSuggestedMinMax: setSuggestedMinMax
    };

    function setScale(scale, value) {
      setMin(scale, value);
      setMax(scale, value);
    }

    function setMin(scale, value) {
        if(scale.min === null) {
          scale.min = value;
        } else if(scale.min > value) {
          scale.min = value;
        }
    }

    function setMax(scale, value) {
        if(scale.max === null) {
          scale.max = value;
        } else if(scale.max < value) {
          scale.max = value;
        }
    }

    function setSuggestedMinMax(scale, range) {
      var gap = scale.max - scale.min;
      if(gap < range) {
        var overlap = (range - gap) / 2;
        scale.suggestedMin = Math.round(scale.min - overlap);
        scale.suggestedMax = Math.round(scale.max + overlap);
      } else {
        scale.suggestedMin = scale.min;
        scale.suggestedMax = scale.max;
      }
    }

    return service;
  }
]);
