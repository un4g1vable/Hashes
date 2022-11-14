// работа с файлами и аргументами
let fs = require ('fs');
let arg = process.argv;

string = fs.readFileSync(arg[arg.length - 2]);
string = string.toString();
substring = fs.readFileSync(arg[arg.length - 1]);
substring = substring.toString();

//Bruteforce
function Bruteforce (str, substr){
    let start_time = performance.now();
    let result = [];
    for (let i = 0; i < str.length - substr.length + 1; i++) {
        let flag = false;
        for (let j = 0; j < substr.length; j++) {
            if (str[i + j] !== substr[j]) {
                flag = true;
                break;
            }
        }
        if (flag)
            continue;
        result.push(i);
    }
    let end_time = performance.now();
    let work_time = end_time - start_time;
    return {result, work_time}
}

//Сумма кодов
function SumHashes (str,substr) {
    let result = [];
    let stringHash = 0;
    let textHash = 0;
    let collision_counter = 0;
    let start_time = performance.now();
    for (let i = 0; i < substr.length; i++) {
        stringHash += substr.charCodeAt(i)
        textHash += str.charCodeAt(i);
    }
    //отдельная проверка первого вхождения
    if (stringHash === textHash){
        for (let i = 0; i < substr.length;i++){
            if (substr[i] !== str[i]) break;
            if (i+1 === substr.length) result.push(i - substr.length + 1);
        }
    }
    let flag;
    for (let j = substr.length; j < str.length; j++) {
        textHash = textHash - str.charCodeAt(j - substr.length) + str.charCodeAt(j);
        if (stringHash === textHash) {
            flag = false;
            for (let i = 0; i < substr.length; i++) {
                if (str[j - substr.length + 1 + i] !== substr[i]) {
                    flag = true;
                    collision_counter +=1;
                    break;
                }
            }
            if (!flag) result.push(j - substr.length + 1);
        }
    }
    let end_time = performance.now();
    let work_time = end_time - start_time;
    return {result, collision_counter,work_time};
}

//сумма квадратов кодов
function SumPowHashes (str,substr) {
    let result = [];
    let stringHash = 0;
    let textHash = 0;
    let collision_counter = 0;
    let start_time = performance.now();
    for (let i = 0; i < substr.length; i++) {
        stringHash += Math.pow(substr.charCodeAt(i), 2);
        textHash += Math.pow(str.charCodeAt(i), 2);
    }
    //отдельная проверка первого вхождения
    if (stringHash === textHash){
        for (let i = 0; i < substr.length;i++){
            if (substr[i] !== str[i]) break;
            if (i+1 === substr.length) result.push(i - substr.length + 1);
        }
    }
    let flag;
    for (let j = substr.length; j < str.length; j++) {
        textHash = textHash - Math.pow(str.charCodeAt(j - substr.length), 2) + Math.pow(str.charCodeAt(j), 2);
        if (stringHash === textHash) {
            flag = false;
            for (let i = 0; i < substr.length; i++) {
                if (str[j - substr.length + 1 + i] !== substr[i]) {
                    flag = true;
                    collision_counter +=1;
                    break;
                }
            }
            if (!flag) result.push(j - substr.length + 1);
        }
    }
    let end_time = performance.now();
    let work_time = end_time - start_time;
    return {result,collision_counter,work_time};
}

//Рабин-Карп
function RabinKarp (str,substr) {
    let result = [];
    let stringHash = 0;
    let textHash = 0;
    let collision_counter = 0;
    let start_time = performance.now();
    for (let i = 0; i < substr.length; i++) {
        stringHash = stringHash * 2 + substr.charCodeAt(i)
        textHash = textHash * 2 + str.charCodeAt(i);
    }
    //отдельная проверка первого вхождения
    if (stringHash === textHash){
        for (let i = 0; i < substr.length;i++){
            if (substr[i] !== str[i]) break;
            if (i+1 === substr.length) result.push(i - substr.length + 1);
        }
    }
    let flag;
    for (let j = substr.length; j < str.length; j++) {
        textHash = 2 * textHash - str.charCodeAt(j - substr.length) * Math.pow(2, substr.length) + str.charCodeAt(j);
        if (stringHash === textHash) {
            flag = false;
            for (let i = 0; i < substr.length; i++) {
                if (str[j - substr.length + 1 + i] !== substr[i]) {
                    flag = true;
                    collision_counter +=1;
                    break;
                }
            }
            if (!flag) result.push(j - substr.length + 1);
        }
    }
    let end_time = performance.now();
    let work_time = end_time-start_time;
    return {result,collision_counter,work_time};
}



//Введение выбора метода
const methods = {
    'h1': SumHashes,
    'h2': SumPowHashes,
    'h3': RabinKarp,
    'b': Bruteforce
};
method = arg[arg.length - 3];

//Введение ключей
let WorkTime = false;
let AmountOfCollision = false;
let AmountOfEntries = -1;
let i = 2;

while (i < arg.length - 3){
    switch (arg[i++]){
        case '-t':
            WorkTime = true;
            break;
        case '-c':
            AmountOfCollision = true;
            break;
        case '-n':
            AmountOfEntries = process.argv[i++];
    }
}
//Вывод
output = methods[method](string, substring)

if (AmountOfEntries > 0){
    console.log(`Индексы вхождений:`);
    console.log (output.result.slice(0, AmountOfEntries));
}
else{
    console.log(`Индексы вхождений:`);
    console.log(output.result);
}
if (AmountOfCollision){
    console.log(`Количество коллизий:`);
    console.log(output.collision_counter);
}
if (WorkTime){
    console.log(`Время работы скрипта:`);
    console.log(output.work_time, `миллисекунд`);
}