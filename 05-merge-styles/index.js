// Импорт всех требуемых модулей
const fsProm = require("fs/promises");
const fs = require("fs");
const path = require("path");

const needPath = path.join(__dirname, "styles");
const bandleFile = path.join(__dirname, "project-dist", "bundle.css");


// Создание файла бандла
fsProm.writeFile(bandleFile, '', err => {
  if (err) {
    throw err
  }
})

async function dirReadind() {
  const files = await fsProm.readdir(needPath); // Чтение содержимого папки styles

  files.forEach(async (file) => {
    // Получение данных о каждом объекте который содержит папка styles
    const filePath = path.join(__dirname, "styles", file);
    const stat = await fsProm.stat(filePath);

    // Проверка объекта на то, что он является файлом
    if (!stat.isDirectory()) {
      const ext = path.extname(file);

      // и имеет ли файл нужное расширение
      if (ext === ".css") {

        // Чтение файла стилей
        fs.readFile(filePath, 'utf-8', (err,content) =>{
          if(err) {
            throw err
          }
          
          // Добавление стилей в бандл
          fs.appendFile(bandleFile, content, err=>{
            if(err){
              throw err
            }
          })
        })
      }
    }
  });

}

dirReadind();