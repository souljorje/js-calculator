function parse (str) {

  str = '';

  while(checkIndex(str)<0) {

    str+=prompt('test', '');

    // Check if there is more than 1 operator at row and cut it
    if (/(\*{2,}|\/{2,}|\-{2,}|\+{2,})/g.test(str)) {

      str = str.slice(0, str.length-1);

    }

    //Check if operator is first char and cut it, except one '-'
    if (str.indexOf('+')==0||str.indexOf('*')==0||str.indexOf('/')==0 || /\-{2,}/g.test(str)) {

      str = str.slice(1, str.length);

    }

  }


  var middleIndex = checkIndex(str),  //Find index of operator in expression
      operand = str[middleIndex],     //Find an operator
      rightSearch = middleIndex + 1,  //Define right part of expression
      right = '';

    //Parse right part of expression
    while (rightSearch < str.length) {
      right = right + str[rightSearch];
      rightSearch++;
    }


  var leftSearch = middleIndex - 1,   //Define left part of expression
      left = '';

    //Parse left part of expression
    while (leftSearch >= 0) {
      left = str[leftSearch] + left;
      leftSearch--;
    }

  // Count an expression depending on operator
  switch (operand) {

    case '+':
      if(+left>0&&+left<1&&+right>0&&+right<1) {

        return dotNumbers(+left, +right);

      }
      else return +left + +right;

    case '-':
      return +left - +right;

    case '*':
      return +left * +right;

    case '/':
      return +left / +right;
  }

}

parse();

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

// Counts numbers with dot: 0.1 - 0.9

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













