# 打包字體說明書

將切割好的手寫字 png 檔打包成 ttf 檔流程 :dog:

網址：https://github.com/chiaoooo/PngToTTF

### 下載專案進行轉換

```
git clone https://github.com/chiaoooo/PngToTTF
```

### 使用下列指令安裝所需套件

```
npm install
```

### PNG ---> SVG

```
node potrace.js
```

> 套件來源 https://www.npmjs.com/package/potrace

- 記得將 input 路徑改為自己的 png 資料夾
- svg 會存在 svg_separate

### SVG ---> SVG

```
node run_pico.js
```

> 套件來源 https://github.com/googlefonts/picosvg

這個步驟為了讓 svg 中的 fill-rule="evenodd" 不被下一個步驟的 svgicons2svgfont 忽略。

- M3 Pro 處理 5,345 字大約需要 148 秒
- 處理過的 SVG 會存在 pico 資料夾
- fillrule 的比較：

| NoneZero                                      | EvenOdd                                       |
| --------------------------------------------- | --------------------------------------------- |
| ![](https://hackmd.io/_uploads/HySD7ASfa.png) | ![](https://hackmd.io/_uploads/rJU_mCSG6.png) |

如果不做這個步驟直接打包，在 fontforge 顯示會長這樣：
![](https://hackmd.io/_uploads/HJwYN0rG6.png)

放大圖：

| 曲                                            | 曙                                            | 曾                                            |
| --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| ![](https://hackmd.io/_uploads/S1GL40HMp.png) | ![](https://hackmd.io/_uploads/ByWUBABfT.png) | ![](https://hackmd.io/_uploads/H16kBRrfa.png) |

### SVG ---> SVG (打包成一個 SVG 檔) ---> TTF & WOFF2

> 套件來源：https://www.npmjs.com/package/svgicons2svgfont

這個步驟跟 https://chiaoooo.github.io/font-svg-viewer/ 不同的地方是不採取替換再打包的方法，而是直接打包現有的 svg 檔，節省空間及時間 ( 31026 kb 縮小至 9252 kb / 12 小時縮短至 2 分鐘 )。

```
node generate_fontfile.js
```

### 完成 !

- 完成以後會在 final_font 裡面看到 ttf 和 woff2 檔
