import $ from 'jquery'

$('.calc-btn-wrap').on('mousedown', function() {
    $(this).addClass('calc-btn-wrap_toggle');
})

$(window).on('mouseup', function() {
    $('.calc-btn-wrap').removeClass('calc-btn-wrap_toggle');
})


// Add item to history
function addExp(display, hist) {
  display.empty().each(function(i) {
    for (var x = 0; x < hist.length; x++){
      $(this).append('<div class="calculator__history-item"><span>' + (x+1 + '.') + '</span>' + hist[x] + '</div>');
    }
  });
}

$(function() {
  var display = document.querySelector('.calculator__screen'),
      subDisplay = document.querySelector('.calculator__supscreen'),
      histDisplay = $('.calculator__history'),
      res = '',
      hist = [];

  $('.calc-btn').on('click', function() {

    // Clear display after result with 'e+'
    if (subDisplay.textContent == 'This is the limit') {
      subDisplay.textContent = ''
    }

    // Clear display after equals sign pressed
    if (res == '') {
      display.textContent = ''
    }

    $("[data-oper='.']").removeAttr('disabled', 'disabled');

    subDisplay.textContent += $(this).val() || $(this).data('oper'); // Small display

    res += $(this).val() || $(this).data('oper'); // Expression of two operands and operator

    subDisplay.scrollLeft = subDisplay.scrollWidth + 20 //Scroll subdisplay to right automatically

    // Count result if there is only one operand
    if ($(this).data('oper')=='=' && /^\d+\=$/g.test(res)) {
      display.textContent = res.slice(0, res.length - 1);
      subDisplay.textContent += res.slice(0, res.length - 1);
      hist.push(subDisplay.textContent);
      subDisplay.textContent = '';
      res = '';
      addExp(histDisplay, hist);
    }

    // Count result if there is only one operand and operator
    if ($(this).data('oper')=='=' && /^\d+(\*|\/|\-|\+)\=$/g.test(res)) {
      display.textContent = res.slice(0, res.length - 2);
      subDisplay.textContent = subDisplay.textContent.slice(0, subDisplay.textContent.length - 2) + $(this).data('oper') + res.slice(0, res.length - 2);
      hist.push(subDisplay.textContent);
      subDisplay.textContent = '';
      res = '';
      addExp(histDisplay, hist);
    }

    console.log('hist: ', hist)

    // Clear screen after result of expression
    if (/^((?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d{1})$/g.test(res) && res[res.length - 2]!=='.') {
      display.textContent = ''
    }

    display.textContent += $(this).val(); // Main display

    // 'C' button
    if ($(this).val()=='C') {
      res = '',
      display.textContent = '',
      subDisplay.textContent = '';
    }

    // Set maximum digit length and prohibit digits like 1.2.3
    if (/^(\d+\.\d+){16}$|(\d+){17}/g.test(subDisplay.textContent) || /\d+\.\d+\./g.test(subDisplay.textContent)) {
      subDisplay.textContent = subDisplay.textContent.slice(0, subDisplay.textContent.length - 1);
      display.textContent = display.textContent.slice(0, display.textContent.length-1);
      res = res.slice(0, res.length-1);
    }

    // Toggle dot on main screen depending on operator or dot on subscreen
    if(/(\*|\/|\-|\+|\.){2,}/g.test(subDisplay.textContent) && /^\d+\.$/g.test(display.textContent)) {
      display.textContent = display.textContent.slice(0, display.textContent.length-1) + $(this).val();
    }

    // Check if there is more than 1 operator or dot at row and cut it
    if(/(\*|\/|\-|\+|\.){2,}/g.test(subDisplay.textContent)) {
      subDisplay.textContent = subDisplay.textContent.slice(0, subDisplay.textContent.length-2) + $(this).data('oper') || '.';
      res = res.slice(0, res.length-2) + $(this).data('oper') || '.';
    }

    // Block dot if expression goes like: operator + operand + operator + operand
    if(/^(\-?(?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d+)(\*|\/|\-|\+|\=)$/g.test(res)) {
      $("[data-oper='.']").attr('disabled', 'disabled');
    }

    // Check if operator or dot is first char and cut it
    if (subDisplay.textContent.indexOf('+')==0 || subDisplay.textContent.indexOf('-')==0 || subDisplay.textContent.indexOf('*')==0 || subDisplay.textContent.indexOf('/')==0 || subDisplay.textContent.indexOf('.')==0 || subDisplay.textContent.indexOf('=')==0) {
      subDisplay.textContent = subDisplay.textContent.slice(1, subDisplay.textContent.length);
      res = res.slice(1, res.length);
      display.textContent = display.textContent.slice(1, res.length);
    }

    // Clear display after equals sign pressed
    if ( /\d+\.\d+\./g.test(display.textContent) || /\.{2,}/g.test(display.textContent)) {
      display.textContent = display.textContent.slice(0, display.textContent.length-1)
    }

    console.log('res: ', res);
    console.log('exp: ', subDisplay.textContent);
    console.log('display: ', display.textContent);

    if (checkIndex(res)>0) {

      var middleIndex = checkIndex(res),  //Find index of operator in expression
          operand = res[middleIndex],     //Find an operator
          rightSearch = middleIndex + 1,     //Define right part of expression
          right = '';

        //Parse right part of expression
        while (rightSearch < res.length - 1) {
          right = right + res[rightSearch];
          rightSearch++;
        }


      var leftSearch = middleIndex - 1,   //Define left part of expression
          left = '';

        //Parse left part of expression
        while (leftSearch >= 0) {
          left = res[leftSearch] + left;
          leftSearch--;
        }
        console.log('left: ', left);
        console.log('right: ', right);

      // Count an expression depending on operator
      switch (operand) {

        case '+':

          if(+left>0&&+left<1&&+right>0&&+right<1) {
            res = dotNumbers(+left, +right);
          }
          else res = +left + +right;
          break;

        case '-':
          res = +left - +right;
          break;

        case '*':
          res = +left * +right;
          break;

        case '/':
          res = +left / +right;
          break;
      }

      if (res == Infinity || isNaN(res)) {
        display.textContent = 'Don\'t divide by zero!';
        res = '';
        subDisplay.textContent = ''
      }

      else if ($(this).data('oper')=='=') {
        display.textContent = res;
        subDisplay.textContent += String(res)
        hist.push(subDisplay.textContent);
        subDisplay.textContent = '';
        res = '';
        addExp(histDisplay, hist);
      }

      else {
        display.textContent = res;
        res += $(this).data('oper');
      }

      if (res.indexOf('e')>-1) {
        display.textContent = res.slice(0, res.length - 1);
        res = '';
        subDisplay.textContent = 'This is the limit'
      }
      console.log('hist: ', hist)
    }
  });
}($));



function checkIndex (str) {

  var operands = ['+', '-', '/', '*'],
      foundExp, // Expression
      foundIndex; //Index of operator

  for (let i = 0; i < str.length; i++) {
    //Check if expression pass regexp: +/- number or fraction, operator, number or fraction
    if (str.match(/(\-?(?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d+)(\*|\/|\-|\+|\=)/)) {
     foundExp = str.match(/(\-?(?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d+)/)[0];
    }
  }
  if (foundExp) {
    //Check if char in expression is operator and find its index
    for(var j = 0; j <  foundExp.length; j++) {
      if (operands.indexOf(foundExp[j]) > -1) {
        foundIndex = foundExp.indexOf(foundExp[j]);
      }
    }

  }
  return foundIndex || -1;
}

// Count fractions: 0.1 - 0.9

function dotNumbers (a, b) {
  var aLength = String(a).length - 2,
      bLength = String(b).length - 2,
      mutator = 10,
      aDividor = 1,
      bDividor = 1;

  for (var i = 0; i < aLength; i++) {
    aDividor*=mutator;
  };

  for (var j = 0; j < bLength; j++) {
    bDividor*=mutator;
  }

  if (aDividor > bDividor) {
    return (a*aDividor + b*aDividor ) / aDividor
  }

  else {
    return (a*bDividor + b*bDividor ) / bDividor
  }

}