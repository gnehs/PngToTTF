const SVGIcons2SVGFontStream = require("svgicons2svgfont");
const svg2ttf = require("svg2ttf");
const fs = require("graceful-fs");
const path = require("path");
const ttf2woff2 = require("ttf2woff2");

const fontName = "MyFont";
const outputSVGFontPath = "final_font/fontpico.svg"; // 輸出SVG字體的路徑
const inputFolder = "pico"; // 包含SVG檔案的資料夾路徑

const fontStream = new SVGIcons2SVGFontStream({
  fontName: fontName,
});
fs.mkdirSync("final_font", { recursive: true });
const files = fs.readdirSync(inputFolder);

function generateSvgFont() {
  return new Promise((resolve, reject) => {
    console.time("Font Generation Time");
    fontStream
      .pipe(fs.createWriteStream(outputSVGFontPath))
      .on("finish", function () {
        console.log("\nFont successfully created!");
        console.timeEnd("Font Generation Time");
        resolve();
      })
      .on("error", function (err) {
        reject(err);
      });

    files.forEach((file) => {
      if (path.extname(file) === ".svg") {
        // 從檔名中提取Unicode
        const unicodeMatch = file.match(/U\+([0-9A-Fa-f]+)/);
        if (unicodeMatch) {
          const unicode = [String.fromCodePoint(parseInt(unicodeMatch[1], 16))];
          const name = "icon_" + unicodeMatch[1]; // 使用Unicode的十六進位表示作為名稱
          const glyph = fs.createReadStream(path.join(inputFolder, file));
          glyph.metadata = { unicode, name };
          fontStream.write(glyph);
        }
      }
    });
    // 結束流
    fontStream.end();
  });
}

async function main() {
  await generateSvgFont();
  console.log("Converting SVG font to TTF...");
  // 將SVG字體轉換為TTF字體
  const svgFont = fs.readFileSync(outputSVGFontPath, "utf8");
  const ttfFont = svg2ttf(svgFont, {});
  fs.writeFileSync(
    `final_font/${fontName}.ttf`,
    new Buffer.from(ttfFont.buffer)
  );
  console.log("TTF font successfully created!");
  fs.unlinkSync(outputSVGFontPath); // 刪除中間產生的SVG字體檔案
  fs.writeFileSync(
    `final_font/${fontName}.woff2`,
    ttf2woff2(new Uint8Array(ttfFont.buffer))
  );
  console.log("WOFF2 font successfully created!");
}
main();
