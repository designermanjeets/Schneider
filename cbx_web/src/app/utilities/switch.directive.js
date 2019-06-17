"use strict";

//This directive is used to create a switch html object
angular.module('conext_gateway.utilities').directive('switch', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: function(element, attrs) {
      var html = '';
      html += '<span';
      html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
      if(attrs.ngModel) {
        html += ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ';
        if(attrs.ngTrueValue === undefined || attrs.ngFalseValue === undefined) {
            html += attrs.ngModel + ' = !' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '(\'' + attrs.formId + '\')"' : '"');
        } else {
          html += attrs.ngModel + ' = ' + '(' + attrs.ngModel + ' ? ' + attrs.ngFalseValue + ' : ' + attrs.ngTrueValue + ')' +
          (attrs.ngChange ? '; ' + attrs.ngChange + '(\'' + attrs.formId + '\')"' : '"');
        }
      }
      html += ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.disabled + ' }"';
      html += ' style="' + (attrs.style ? attrs.style : '') + '"';
      html += '>';
      html += '<small></small>';
      html += '<input type="checkbox"';
      html += attrs.id ? ' id="' + attrs.id + '"' : '';
      html += attrs.name ? ' name="' + attrs.name + '"' : '';
      html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '" ' : '';
      html += attrs.ngTrueValue ? ' ng-true-value="' + attrs.ngTrueValue + '" ' : '';
      html += attrs.ngFalseValue ? ' ng-true-value="' + attrs.ngFalseValue + '" ' : '';
      html += 'style="display:none" />';
      html += '<span class="switch-text">'; /*adding new container for switch text*/
      html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : ''; /*switch text on value set by user in directive html markup*/
      html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' '; /*switch text off value set by user in directive html markup*/
      html += '</span>';
      return html;
    }
  };
});
