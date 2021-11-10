const fs = require("fs/promises");
const fsNoProm = require("fs");
const path = require("path");

const dir = path.join(__dirname, "files");
const copy = path.join(__dirname, "files-copy");

function clearDirectory(){
  fsNoProm.readdir(copy, (err, files) => {
  if (err) throw err;

  for (let i=0; i<files.length; i++){
    let copyF = path.join(copy, files[i]);
    console.log(copyF)

    fsNoProm.unlink(copyF, (err) => {
      if (err) throw err;
    });
  };
});
}
async function double() {

  await fs.mkdir(copy, { recursive: true });

///
clearDirectory()
///

  const files = await fs.readdir(dir);

  files.forEach(async (file) => {
    const baseFile = path.join(__dirname, "files", file);
    const newFile = path.join(__dirname, "files-copy", file);
    await fs.copyFile(baseFile, newFile);
  });
}

double();
