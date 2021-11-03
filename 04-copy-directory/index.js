const fs = require("fs/promises");
const path = require("path");

const dir = path.join(__dirname, "files");

async function double() {

  await fs.mkdir(path.join(__dirname, "files-copy"), { recursive: true });
  const files = await fs.readdir(dir);

  files.forEach(async (file) => {
    const baseFile = path.join(__dirname, "files", file);
    const newFile = path.join(__dirname, "files-copy", file);
    await fs.copyFile(baseFile, newFile);
  });
}

double();