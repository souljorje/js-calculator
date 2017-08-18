import $ from 'jquery'

$('.calc-btn-wrap').on('mousedown', function() {
    $(this).addClass('calc-btn-wrap_toggle');
})
$(window).on('mouseup', function() {
    $('.calc-btn-wrap').removeClass('calc-btn-wrap_toggle');
})

$(function() {
  var display = document.querySelector('.calculator__screen'),
      subdisplay = document.querySelector('.calculator__supscreen'),
      res = '',
      cutres = '';

      $('[data-oper]').on('click', function() {
        $('[data-oper]').removeAttr('disabled', '');
        $(this).attr('disabled', '');
      })

      $('.calc-btn').on('click', function() {

        if ($(this).data('oper')) {
          res += display.textContent + $(this).data('oper');
        }

        // if ($(this).data('oper')&&/\d(\*|\/|\-|\+|\.)/g.test(res)) {
        //   res = display.textContent + $(this).data('oper')
        // }

        // if (/(\-?(?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d+)/g.test(res)) {

        // }

        // if(/(\*|\/|\-|\+|\.){2,}/g.test(res)) {

        // }

        // Clear screen after result
        if ((display.textContent == cutres) || subdisplay.textContent[subdisplay.textContent.length-1]=='+' || subdisplay.textContent[subdisplay.textContent.length-1]=='-' || subdisplay.textContent[subdisplay.textContent.length-1]=='*' || subdisplay.textContent[subdisplay.textContent.length-1]=='/') {
          display.textContent = ''
        }

        display.textContent += $(this).val();

        subdisplay.textContent += $(this).val() || $(this).data('oper');

        cutres = res.slice(0, res.length - 1);

        // subdisplay.textContent = exp

        console.log('res: ', res);
        console.log('exp: ', subdisplay.textContent);
        console.log('cutres: ', cutres);
        console.log('display: ', display.textContent);


        if (/\d{17}/g.test(subdisplay.textContent)||/((?:\d\.)?\d){16,}/g.test(subdisplay.textContent)||/\d+\.\d+\./g.test(subdisplay.textContent)) {
          subdisplay.textContent = subdisplay.textContent.slice(0, subdisplay.textContent.length - 1)
        }

        // Check if there is more than 1 operator or dot at row and cut it
        if(/(\*|\/|\-|\+|\.){2,}/g.test(subdisplay.textContent)) {
          subdisplay.textContent = subdisplay.textContent.slice(0, subdisplay.textContent.length-2) + $(this).data('oper');
          res = res.slice(0, res.length-2) + $(this).data('oper');
        }
        //Check if operator or dot is first char and cut it, except single '-'
        if (subdisplay.textContent.indexOf('+')==0 || subdisplay.textContent.indexOf('*')==0 || subdisplay.textContent.indexOf('/')==0 || subdisplay.textContent.indexOf('.')==0 || /\-{2,}/g.test(subdisplay.textContent)) {
          subdisplay.textContent = subdisplay.textContent.slice(1, subdisplay.textContent.length);
        }

        if (display.textContent.length >= 17 || /\d+\.\d+\./g.test(display.textContent)) {
          display.textContent = display.textContent.slice(0, display.textContent.length-1)
        }

        else if (checkIndex(cutres)>0) {

          var middleIndex = checkIndex(cutres),  //Find index of operator in expression
              operand = cutres[middleIndex],     //Find an operator
              rightSearch = middleIndex + 1,     //Define right part of expression
              right = '';

            //Parse right part of expression
            while (rightSearch < cutres.length) {
              right = right + cutres[rightSearch];
              rightSearch++;
            }


          var leftSearch = middleIndex - 1,   //Define left part of expression
              left = '';

            //Parse left part of expression
            while (leftSearch >= 0) {
              left = cutres[leftSearch] + left;
              leftSearch--;
            }

          // Count an expression depending on operator
          switch (operand) {

            case '+':
              if(+left>0&&+left<1&&+right>0&&+right<1) {

                cutres = dotNumbers(+left, +right);

              }
              else cutres = +left + +right;
              break;

            case '-':
              cutres = +left - +right;
              break;
            case '*':
              cutres = +left * +right;
              break;

            case '/':
              cutres = +left / +right;
              break;
          }
          display.textContent = cutres;
          res = String(cutres) + $(this).data('oper');
        }
      });
}($));

// $('.calc-btn').on('click', function() {

//   str = '';

//   while(checkIndex(str)<0) {

//     str+=prompt('test', '');

//     // Check if there is more than 1 operator at row and cut it
//     if (/(\*{2,}|\/{2,}|\-{2,}|\+{2,})/g.test(str)) {
//       str = str.slice(0, str.length-1);
//     }

//     //Check if operator is first char and cut it, except one '-'
//     if (str.indexOf('+')==0||str.indexOf('*')==0||str.indexOf('/')==0 || /\-{2,}/g.test(str)) {
//       str = str.slice(1, str.length);
//     }

//   }


  // var middleIndex = checkIndex(str),  //Find index of operator in expression
  //     operand = str[middleIndex],     //Find an operator
  //     rightSearch = middleIndex + 1,  //Define right part of expression
  //     right = '';

  //   //Parse right part of expression
  //   while (rightSearch < str.length) {
  //     right = right + str[rightSearch];
  //     rightSearch++;
  //   }


  // var leftSearch = middleIndex - 1,   //Define left part of expression
  //     left = '';

  //   //Parse left part of expression
  //   while (leftSearch >= 0) {
  //     left = str[leftSearch] + left;
  //     leftSearch--;
  //   }

  // // Count an expression depending on operator
  // switch (operand) {

  //   case '+':
  //     if(+left>0&&+left<1&&+right>0&&+right<1) {

  //       return dotNumbers(+left, +right);

  //     }
  //     else return +left + +right;

  //   case '-':
  //     return +left - +right;

  //   case '*':
  //     return +left * +right;

  //   case '/':
  //     return +left / +right;
  // }

// });


function checkIndex (str) {

  var operands = ['+', '-', '/', '*'],
      foundExp, // Expression
      foundIndex; //Index of operator

  for (let i = 0; i < str.length; i++) {
    //Check if expression pass regexp: +/- number or fraction, operator, number or fraction
    if (str.match(/(\-?(?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d+)/g)) {
     foundExp = str.match(/(\-?(?:\d*\.)?\d+(\*|\/|\-|\+)(?:\d*\.)?\d+)/g)[0];
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
  var aLength = String(a).length - 2;
  var bLength = String(b).length - 2;
  var mutator = 10;
  var aDividor = 1;
  var bDividor = 1;

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