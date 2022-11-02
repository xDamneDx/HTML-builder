const fs = require("fs");
const path = require("path");

fs.readdir(
  path.join(__dirname, "secret-folder"),
  { withFileTypes: true },
  (_, files) => {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, "secret-folder", file.name), (_, stats) => {
        if (!stats.isDirectory()) {
          const name = path.parse(file.name).name;
          const ext = path.extname(file.name).slice(1);
          const size = (stats.size / 1024).toFixed(3);
          console.log(`${name} - ${ext} - ${size}kb`);
        }
      });
    });
  }
);
