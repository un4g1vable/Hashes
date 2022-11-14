# Поиск подстроки в строке
Программа выводит индексы всех вхождений подстроки в строке

# Реализованы следующие методы:

Brute force(b)\
Hashes: сумма кодов(h1)\
Hashes: сумма квадратов кодов(h2)\
Hashes: Рабина-Карпа(h3)

# Запуск:

>node hash.js [ключи] [b/h1/h2/h3] string_file substring_file

# Ключи:
-с - помимо списка вхождений вывести число коллизий (только хэши)\
-n N, где N - произвольное натуральное число - вывести первые N вхождений\
-t - вывести время работы алгоритма

