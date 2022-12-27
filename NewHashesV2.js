// работа с файлами и аргументами
let fs = require ('fs');
let arg = process.argv;

string = fs.readFileSync(arg[arg.length - 2]);
string = string.toString();
// ^ чтение файла из предпоследнего аргумента в строку (строка)
substring = fs.readFileSync(arg[arg.length - 1]);
substring = substring.toString();
// ^ чтение файла из последнего аргумента в строку (подстрока)

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

//Bruteforce
function Bruteforce (str, substr){
    let start_time = performance.now(); //запусак секундомера
    let result = [];
    for (let i = 0; i < str.length - substr.length + 1; i++)
        // ^ идём по исходной строке
    {
        let flag = false;
        // ^ изначально флаг false
        for (let j = 0; j < substr.length; j++)
            // ^ идём по подстроке, пока элементы строки и подстроки сходятся, до конца длины подстроки
        {
            if (str[i + j] !== substr[j]) {
                // ^ если элемент строки не сходится с элементом подстроки
                flag = true;
                // ^ флаг принимает значение true
                break;
                // прерываем
            }
        }
        if (flag)
            continue;
        // если состояние флага осталось true и мы не нашли подстроки в строке на данный момент,
        // то возвращаемся в цикл, при этом не добавляя ничего в результат
        result.push(i);
        // если подстрока нашлась в строке, то мы выйдем из циклов со значением флага
        // false, что позволит нам добраться до строки с добавлением индекса первого вхождения в результат
        if (result.length < AmountOfEntries)
            continue;
        else if (AmountOfEntries === -1)
            continue;
        else
            break
    }
    let end_time = performance.now(); //остановка секундомера
    let work_time = end_time - start_time; //расчёт времени
    return {result, work_time} // возвращаем массив с индексами и время работы
}

//Сумма кодов
function SumHashes (str,substr) {
    let result = [];
    let stringHash = 0;
    let textHash = 0;
    let collision_counter = 0;
    let start_time = performance.now(); // запускаем секундомер
    for (let i = 0; i < substr.length; i++) {
        stringHash += substr.charCodeAt(i)
        textHash += str.charCodeAt(i);
    }
    // ^ складываем суммы хэшей, пока не дойдём до конца подстроки

    //отдельная проверка первого вхождения (костыль, т.к. цикл ниже почему-то не справляется с нахождением первого вхождения)
    if (stringHash === textHash){
        // ^ если хэши сходятся
        for (let i = 0; i < substr.length;i++){
            if (substr[i] !== str[i]) break;
            // ^ если элементы не сходятся - выходим
            if (i+1 === substr.length) result.push(i - substr.length + 1);
            // ^ если подстрока нашлась в строке - добавляем в результат
        }
    }
    let flag;
    for (let j = substr.length; j < str.length; j++) {
        textHash = textHash - str.charCodeAt(j - substr.length) + str.charCodeAt(j);
        // ^ смещаемся правее по строке до тех пор, пока хэши не сойдутся
        if (stringHash === textHash) {
            flag = false;
            // ^ как только они сошлись - flag = false
            for (let i = 0; i < substr.length; i++) {
                if (str[j - substr.length + 1 + i] !== substr[i]) {
                    flag = true;
                    collision_counter +=1;
                    break;
                    // ^ если у нас какой-либо символ не сошёлся - flag = true, мы нашли коллизцию, выходим
                }
            }
            if (!flag) result.push(j - substr.length + 1);
            // ^ если flag остался в положении false, значит мы вышли из цикла с найденной подстрокой в строке
            // добавляем индекс первого элемента в результат
        }
        if (result.length < AmountOfEntries)
            continue;
        else if (AmountOfEntries === -1)
            continue;
        else
            break
    }
    let end_time = performance.now(); //отключаем секундомер
    let work_time = end_time - start_time; //считаем время
    return {result, collision_counter,work_time};
}

//сумма квадратов кодов
function SumPowHashes (str,substr) {
    let result = [];
    let stringHash = 0;
    let textHash = 0;
    let collision_counter = 0;
    let start_time = performance.now(); // запускаем секундомер
    for (let i = 0; i < substr.length; i++) {
        stringHash += Math.pow(substr.charCodeAt(i), 2);
        textHash += Math.pow(str.charCodeAt(i), 2);
    }
// ^ складываем суммы квадратов хэшей, пока не дойдём до конца подстроки


    //отдельная проверка первого вхождения
    if (stringHash === textHash){
        for (let i = 0; i < substr.length;i++){
            if (substr[i] !== str[i]) break;
            // ^ если элементы не сходятся - выходим
            if (i+1 === substr.length) result.push(i - substr.length + 1);
            // ^ если подстрока нашлась в строке - добавляем в результат
        }
    }
    let flag;
    for (let j = substr.length; j < str.length; j++) {
        textHash = textHash - Math.pow(str.charCodeAt(j - substr.length), 2) + Math.pow(str.charCodeAt(j), 2);
        // ^ смещаемся правее по строке до тех пор, пока хэши не сойдутся
        if (stringHash === textHash) {
            flag = false;
            // ^ как только они сошлись - flag = false
            for (let i = 0; i < substr.length; i++) {
                if (str[j - substr.length + 1 + i] !== substr[i]) {
                    flag = true;
                    collision_counter +=1;
                    break;
                    // ^ если у нас какой-либо символ не сошёлся - flag = true, мы нашли коллизцию, выходим
                }
            }
            if (!flag) result.push(j - substr.length + 1);
            // ^ если flag остался в положении false, значит мы вышли из цикла с найденной подстрокой в строке
            // добавляем индекс первого элемента в результат
        }
        if (result.length < AmountOfEntries)
            continue;
        else if (AmountOfEntries === -1)
            continue;
        else
            break
    }
    let end_time = performance.now(); //отключаем секундомер
    let work_time = end_time - start_time; //считаем время
    return {result,collision_counter,work_time};
}

//Рабин-Карп
function RabinKarp (str,substr) {
    let result = [];
    let stringHash = 0;
    let textHash = 0;
    let collision_counter = 0;
    let start_time = performance.now(); // запускаем секундомер
    for (let i = 0; i < substr.length; i++) {
        stringHash = stringHash * 2 + substr.charCodeAt(i)
        textHash = textHash * 2 + str.charCodeAt(i);
    }
    // Накапливаем хэши строки и подстроки исходя из алгоритма Рабина-Карпа

    //отдельная проверка первого вхождения
    if (stringHash === textHash){
        for (let i = 0; i < substr.length;i++){
            if (substr[i] !== str[i]) break;
            // ^ если элементы не сходятся - выходим
            if (i+1 === substr.length) result.push(i - substr.length + 1);
            // ^ если подстрока нашлась в строке - добавляем в результат
        }
    }
    let flag;
    for (let j = substr.length; j < str.length; j++) {
        textHash = 2 * textHash - str.charCodeAt(j - substr.length) * Math.pow(2, substr.length) + str.charCodeAt(j);
        // ^ смещаемся правее по строке до тех пор, пока хэши не сойдутся
        if (stringHash === textHash) {
            flag = false;
            // ^ как только они сошлись - flag = false
            for (let i = 0; i < substr.length; i++) {
                if (str[j - substr.length + 1 + i] !== substr[i]) {
                    flag = true;
                    collision_counter +=1;
                    break;
                    // ^ если у нас какой-либо символ не сошёлся - flag = true, мы нашли коллизцию, выходим
                }
            }
            if (!flag) result.push(j - substr.length + 1);
            // ^ если flag остался в положении false, значит мы вышли из цикла с найденной подстрокой в строке
            // добавляем индекс первого элемента в результат
        }
        if (result.length < AmountOfEntries)
            continue;
        else if (AmountOfEntries === -1)
            continue;
        else
            break
    }
    let end_time = performance.now(); //останавливаем таймер
    let work_time = end_time-start_time; //считаем время
    return {result,collision_counter,work_time};
}


//Вывод
output = methods[method](string, substring)

console.log(`Индексы вхождений:`);
console.log(output.result);

if (AmountOfCollision){
    console.log(`Количество коллизий:`);
    console.log(output.collision_counter);
}
if (WorkTime){
    console.log(`Время работы скрипта:`);
    console.log(output.work_time, `миллисекунд`);
}