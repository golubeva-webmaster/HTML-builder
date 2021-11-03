// Импорт всех требуемых модулей
const fs = require("fs/promises");
const path = require("path");

const needPath = path.join(__dirname, "secret-folder");

async function dirReadind() {
  const files = await fs.readdir(needPath); // Чтение содержимого папки secret-folder

  files.forEach(async (file) => {
    // Получение данных о каждом объекте который содержит папка secret-folder
    const filePath = path.join(__dirname, "secret-folder", file);
    const stat = await fs.stat(filePath);
    if (!stat.isDirectory()) {
      // Проверка объекта на то, что он является файлом
      const ext = path.extname(file);
      const res = `${ext.slice(1)} - ${Math.round(
        stat.size / 1024
      )}kb`;
      console.log(path.basename(file, ext) + ' - ' + res);
    }
  });
}

dirReadind();