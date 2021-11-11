const fs = require("fs");
const fsProm = require("fs/promises");
const path = require("path");

const pathToCssSource = path.join(__dirname, "styles");
const pathToHtmlSource = path.join(__dirname, "template.html");
const pathToAssetsSource = path.join(__dirname, "assets");
const pathToComponentsSource = path.join(__dirname, "components");
const pathToCssBundle = path.join(__dirname, "project-dist", "style.css");
const pathToAssetsBundle = path.join(__dirname, "project-dist", "assets");
const pathToHtmlBundle = path.join(__dirname, "project-dist", "index.html");
const outputDir = "project-dist";

let objTemplatePoints = {};
let htmlFile = "";


async function crateBuildFolder() {
  let outputDirPath = path.resolve(__dirname, outputDir);
  await fs.promises.rm(outputDirPath, { recursive: true, force: true });
  await fs.promises.mkdir(outputDirPath, { recursive: true });
}

async function createHtmlBundle() {
  const files = await fsProm.readdir(pathToComponentsSource); // Чтение содержимого папки

  // Прочитаем файл шаблона
  const readable = fs.createReadStream(pathToHtmlSource, "utf8");

  readable.on("data", (chunk) => {
    htmlFile = chunk.toString(); // Прочтение и сохранение в переменной файла-шаблона
  });

  files.forEach(async (file) => {
    // Получение данных о каждом объекте который содержит папка
    const filePath = path.join(pathToComponentsSource, file);
    const stat = await fsProm.stat(filePath);
    if (!stat.isDirectory()) {
      // Проверка объекта на то, что он является файлом
      const ext = path.extname(file);
      if (ext === ".html") {
        let templatePart = path.basename(file, ext);

        // чтение файла html
        fs.readFile(filePath, "utf-8", (err, content) => {
          if (err) {
            throw err;
          }

          objTemplatePoints[templatePart] = content;

          if (htmlFile.includes(templatePart)) {
            // Нахождение всех имён тегов в файле шаблона
            //файл шаблона содержит кусок {{templatePart}}

            let readable = fs.createReadStream(pathToHtmlSource, "utf8");

            readable.on("data", (chunk) => {
              htmlFile = htmlFile.replace(
                `{{${templatePart}}}`,
                objTemplatePoints[templatePart]
              ); // Замена шаблонных тегов содержимым файлов-компонентов
            });
            readable.on("end", async () => {
              await fsProm.writeFile(pathToHtmlBundle, htmlFile, "utf8");
            });
          }
        });
      }
    }
  });
}

function createCssBundle() {
  fsProm.writeFile(pathToCssBundle, "", (err) => {
    if (err) {
      throw err;
    }
  });

  async function dirReadind() {
    const files = await fsProm.readdir(pathToCssSource);

    files.forEach(async (file) => {
      const filePath = path.join(__dirname, "styles", file);
      const stat = await fsProm.stat(filePath);

      if (!stat.isDirectory()) {
        const ext = path.extname(file);

        if (ext === ".css") {
          fs.readFile(filePath, "utf-8", (err, content) => {
            if (err) {
              throw err;
            }

            fs.appendFile(pathToCssBundle, content, (err) => {
              if (err) {
                throw err;
              }
            });
          });
        }
      }
    });
  }
  dirReadind();
}

async function copyAssets(pathBundle, pathSource) {
  await fsProm.mkdir(pathBundle, { recursive: true });
  const files = await fsProm.readdir(pathSource);

  files.forEach(async (file) => {
    const baseFile = path.join(pathSource, file);
    const newFile = path.join(pathBundle, file);
    const stat = await fsProm.stat(baseFile);
    if (stat.isDirectory()) {
      copyAssets(newFile, baseFile);
    } else {
      await fsProm.copyFile(baseFile, newFile);
    }
  });
}

async function buildPage() {
  await crateBuildFolder();
    createHtmlBundle();
    createCssBundle();
    copyAssets(pathToAssetsBundle, pathToAssetsSource);
}
buildPage();
