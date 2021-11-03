//Импортировать необходимые для выполнения задания модули
const fs = require("fs");
const path = require("path"); //Для корректного указания пути к файлу

const pathRead = path.join(__dirname, "text.txt");
const readable = fs.createReadStream(pathRead, "utf8"); //Создать новый ReadStream из файла text.txt

//Направить поток чтения в стандартный поток вывода
readable.on("data", (chunk) => {
  console.log(chunk); // process.stdout.write(chunk);
});