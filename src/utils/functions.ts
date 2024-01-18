export function bubbleSortObject(arr: any[], key: string | number) {
  for (let i = 0; i < arr.length; i++) {
    // Last i elements are already in place
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Checking if the item at present iteration
      // is greater than the next iteration
      if (arr[j][key] > arr[j + 1][key]) {
        // If the condition is true
        // then swap them
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}


export function copyStringToClipboard(input: string) {
  let el = document.createElement('textarea');
  el.value = input;
  el.setAttribute('readonly', '');
  //@ts-ignore
  el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export function rounder(value: number | string | null | undefined, charLength: number = 5) {
  if(!value) return '-'
  let splited = ['',''];
  if(typeof(value) === 'string'){
    if(value.includes('.')){
      splited = value.split('.');
    } else if(value.includes(',')) {
      splited = value.split(',');
    } else {
      splited = [`${value}`, '0']
    }
    value = parseFloat(value);
  } else {
    splited = [`${value}`, '0']
  }
  let rez: string | null = null;
  if (value >= 99999999999999) {
    let numLength = splited[0].length;
    rez = `${splited[0][0]}.${splited[0][1]}${splited[0][2]}x10e${numLength-1}`;
  } else if (value >= 1000) {
    let suffixes = ["", "k", "m", "b","t"];
    let suffixNum = Math.floor( (""+value).length/3 );
    let shortValue: number | null | string = NaN;
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue && shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
      rez = shortValue+suffixes[suffixNum];
  } else if (value >= 100) {
    let decilalNum = charLength - 4;
    rez = value.toFixed(decilalNum)
  } else if (value >= 10) {
    let decilalNum = charLength - 3;
    rez = value.toFixed(decilalNum)
  } else {
    let decilalNum = charLength - 2;
    rez = value.toFixed(decilalNum)
  }
  if(parseFloat(rez) !== value) rez = '~' + rez;
  return rez;
}

