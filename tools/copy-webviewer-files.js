const fs = require("fs-extra");
const path = require("path");

const copyFiles = async () => {
   const source = path.join(
      __dirname,
      "../node_modules/@pdftron/webviewer/public"
   );
   const destination = path.join(__dirname, "../public/webviewer");

   try {
      await fs.copy(source, destination);
      console.log("WebViewer files copied successfully");
   } catch (err) {
      console.error("Error copying WebViewer files:", err);
      process.exit(1);
   }
};

copyFiles();
