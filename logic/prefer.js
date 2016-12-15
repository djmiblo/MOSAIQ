var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var preference = {
  '정치': 1000,
  '경제': 1000,
  '사회': 1000,
  '국제': 1000,
  '기술': 1000,
  '스포츠': 1000,
  '문화': 1000,
}

function printInterface() {
  console.log('');
  console.log('(1): 정치   ' + preference['정치']);
  console.log('(2): 경제   ' + preference['경제']);
  console.log('(3): 사회   ' + preference['사회']);
  console.log('(4): 국제   ' + preference['국제']);
  console.log('(5): 기술   ' + preference['기술']);
  console.log('(6): 스포츠 ' + preference['스포츠']);
  console.log('(7): 문화   ' + preference['문화']);
  process.stdout.write("> ");
}

function updatePref(score) {
  var diff = 300000 / score;
  return score + diff;
}

function selectType(n) {
  switch (n) {
    case 1:
      preference['정치'] = updatePref(preference['정치']);
      break;
    case 2:
      preference['경제'] = updatePref(preference['경제']);
      break;
    case 3:
      preference['사회'] = updatePref(preference['사회']);
      break;
    case 4:
      preference['국제'] = updatePref(preference['국제']);
      break;
    case 5:
      preference['기술'] = updatePref(preference['기술']);
      break;
    case 6:
      preference['스포츠'] = updatePref(preference['스포츠']);
      break;
    case 7:
      preference['문화'] = updatePref(preference['문화']);
      break;
    default:
      console.log('[System] Routine should not reach here...');
      break;
  }
  normalize();
}

function normalize() {
  var sum = 0;
  Object.keys(preference).forEach(function(type) {
    sum += preference[type];
  })

  Object.keys(preference).forEach(function(type) {
    preference[type] *= 7000;
    preference[type] /= sum;
  })
}

printInterface();
rl.on('line', function(line){
  var select = Number(line);
  if (select == NaN)
    console.log('[System] You have to choose between 1-7');
  else {
    selectType(select);
  }

  printInterface();
})

