const fs = require("fs");
const fsPropmise = require("fs/promises");
const path = require("path");

const projectDist = path.join(__dirname, "project-dist");
const indexFile = path.join(projectDist, "index.html");
const stylesFile = path.join(projectDist, "style.css");
const assetsDir = path.join(__dirname, "assets");
const stylesDir = path.join(__dirname, "styles");
const templateFile = path.join(__dirname, "template.html");
const componentsDir = path.join(__dirname, "components");

fs.rm(projectDist, { recursive: true }, () => {
  fs.mkdir(projectDist, { recursive: true }, () => {
    // Copy assets folder:
    fs.readdir(assetsDir, (_, folders) => {
      folders.forEach((folder) => {
        fs.mkdir(
          path.join(projectDist, "assets", folder),
          { recursive: true },
          () => {
            fs.readdir(path.join(assetsDir, folder), (_, files) => {
              files.forEach((file) => {
                fs.copyFile(
                  path.join(assetsDir, folder, file),
                  path.join(projectDist, "assets", folder, file),
                  () => {}
                );
              });
            });
          }
        );
      });
    });

    // Bundle styles:
    fs.readdir(stylesDir, { withFileTypes: true }, (_, files) => {
      const bundleWriteStream = fs.createWriteStream(stylesFile);
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === ".css") {
          let data = "";
          const readStream = fs.createReadStream(
            path.join(stylesDir, file.name),
            "utf-8"
          );

          readStream.on("data", (chunk) => (data += chunk));
          readStream.on("end", () => {
            bundleWriteStream.write(data);
          });
        }
      });
    });

    // Create index.html from template/components:
    createIndexPage();
  });
});

const createIndexPage = async () => {
  const template = await fsPropmise.readFile(templateFile, "utf-8");
  const components = await fsPropmise.readdir(componentsDir, {
    withFileTypes: true,
  });
  let result = template;

  for (const component of components) {
    await fsPropmise
      .readFile(path.join(componentsDir, component.name), "utf-8")
      .then((componentData) => {
        result = result.replace(
          `{{${path.parse(component.name).name}}}`,
          componentData
        );
      });
  }

  await fsPropmise.writeFile(indexFile, result);
};
