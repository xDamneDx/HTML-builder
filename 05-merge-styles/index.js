const fs = require("fs");
const path = require("path");

const stylesDir = path.join(__dirname, "styles");
const bundleCSS = path.join(__dirname, "project-dist", "bundle.css");

fs.rm(bundleCSS, () => {
  fs.readdir(stylesDir, { withFileTypes: true }, (_, files) => {
    const bundleWriteStream = fs.createWriteStream(bundleCSS);
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".css") {
        const input = fs.createReadStream(
          path.join(stylesDir, file.name),
          "utf-8"
        );
        let data = "";

        input.on("data", (chunk) => (data += chunk));
        input.on("end", () => {
          bundleWriteStream.write(data);
          console.log(
            `File ${file.name}, was successfully bundled into bundle.css`
          );
        });
      }
    });
  });
});
