/*
Прочтение и сохранение в переменной файла-шаблона
Нахождение всех имён тегов в файле шаблона
Замена шаблонных тегов содержимым файлов-компонентов
Запись изменённого шаблона в файл index.html в папке project-dist
Использовать скрипт написанный в задании 05-merge-styles для создания файла style.css
Использовать скрипт из задания 04-copy-directory для переноса папки assets в папку project-dist
*/
// Импорт всех требуемых модулей
// const fs = require("fs/promises");
const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');

const pathToCssSource = path.join(__dirname, 'styles');
const pathToHtmlSource = path.join(__dirname, 'template.html');
const pathToAssetsSource = path.join(__dirname, 'assets');
const pathToComponentsSource = path.join(__dirname, 'components');
const pathToCssBundle = path.join(__dirname, 'project-dist', 'style.css');
const pathToAssetsBundle = path.join(__dirname, 'project-dist', 'assets');
const pathToHtmlBundle = path.join(__dirname, 'project-dist', 'index.html');

const needPath = path.join(__dirname, "styles"); //pathToCssSource
const bandleFile = path.join(__dirname, "project-dist", "bundle.css"); //pathToCssBundle
let objTemplatePoints = {}
let htmlFile = '';

async function crateBuildFolder() {
  const newFolderPath = path.join(__dirname, 'project-dist');
  await fsProm.mkdir(newFolderPath, { recursive: true });
}

async function createHtmlBundle() {
  
  // readDir()
  // const articles = await fsProm.readFile(path.join(pathToComponentsSource, 'articles.html'));
  // const footer = await fsProm.readFile(path.join(pathToComponentsSource, 'footer.html'));
  // const header = await fsProm.readFile(path.join(pathToComponentsSource, 'header.html'));

  const files = await fsProm.readdir(pathToComponentsSource); // Чтение содержимого папки

  // Прочитаем файл шаблона
  const readable = fs.createReadStream(pathToHtmlSource, 'utf8');

  readable.on('data', (chunk) => {
    htmlFile = chunk.toString()
    // htmlFile = htmlFile.replace('{{footer}}', footer);
  });


  files.forEach(async (file) => {
    // Получение данных о каждом объекте который содержит папка
    const filePath = path.join(pathToComponentsSource, file);
    const stat = await fsProm.stat(filePath);
    if (!stat.isDirectory()) {
      // Проверка объекта на то, что он является файлом
      const ext = path.extname(file);
      if(ext === '.html'){
        let templatePart = path.basename(file, ext)
        console.log(templatePart)
        // чтение файла html
        fs.readFile(filePath, 'utf-8', (err,content) =>{
          if(err) {
            throw err
          }
          
          objTemplatePoints[templatePart] = content
          // Если в шаблоне есть {{...}}, заменить
          if(htmlFile.includes(templatePart)){
            console.log('файл шаблона содержит кусок '+templatePart)
            htmlFile.replace('templatePart', content)


            const readable = fs.createReadStream(pathToHtml, 'utf8');
            readable.on('data', (chunk) => {
              htmlFile = chunk.toString().replace('templatePart', content)
              // htmlFile = htmlFile.replace('{{footer}}', footer);
            });
            readable.on('end', async () => {
              await fsProm.writeFile(pathToHtmlBundle, htmlFile, 'utf8');
            });
          }
        })

      }
    }
    // console.log(file)
    // await console.log('objTemplatePoints = ', objTemplatePoints)
  });  
  


}

function createCssBundle(){
  fsProm.writeFile(pathToCssBundle, '', err => {
    if (err) {
      throw err
    }
  })

  async function dirReadind() {
    const files = await fsProm.readdir(pathToCssSource);

    files.forEach(async (file) => {
      const filePath = path.join(__dirname, "styles", file);
      const stat = await fsProm.stat(filePath);

      if (!stat.isDirectory()) {
        const ext = path.extname(file);

        if (ext === ".css") {

          fs.readFile(filePath, 'utf-8', (err,content) =>{
            if(err) {
              throw err
            }
            
            fs.appendFile(pathToCssBundle, content, err=>{
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

