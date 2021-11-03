// Подключаем пакеты
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const process = require("process");
const input = process.stdin;
const output = process.stdout;

const needPath = path.join(__dirname, "text.txt");
let stream = fs.createWriteStream(needPath); // Создание потока записи в текстовый файл
const rl = readline.createInterface({ input, output });

//Реализация прощального сообщения при остановке процесса
const byeFunction = () => {
  rl.write("Bye!");
  process.exit(0);
};

//Вывод в консоль приветственного сообщения
rl.write('Please, input text. Ppress "CTRL+C" or print "exit" for exit:\n');

//Ожидание ввода текста пользователем, с дальнейшей проверкой ввода на наличие ключевого слова exit
rl.addListener("line", (input) => {
  if (input === "exit") {
    byeFunction();
  }
  stream.write(input + "\n"); //Запись текста в файл
});

rl.addListener("close", () => {
  byeFunction();
});
