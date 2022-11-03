const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "files");
const destination = path.join(__dirname, "files-copy");

fs.rm(destination, { recursive: true }, () => {
  fs.mkdir(destination, { recursive: true }, () => {
    fs.readdir(target, (_, files) => {
      files.forEach((file) => {
        fs.copyFile(
          path.join(target, file),
          path.join(destination, file),
          () => {}
        );
      });
      console.log(
        `All files were copied...\nFrom: ${target}\nTo: ${destination}`
      );
    });
  });
});
