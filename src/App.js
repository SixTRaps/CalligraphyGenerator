import React from "react";
import { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

function App() {
  const [previewText, setPreviewText] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [font, setFont] = useState("如花似梦行楷");
  const [fontSize, setFontSize] = useState(36);
  const [language, setLanguage] = useState("中文");

  const contentRef = useRef();
  const titleRef = useRef();
  const authorRef = useRef();
  const previewTextRef = useRef();
  const fontRef = useRef();
  const fontSizeRef = useRef();
  const headerRef = useRef();
  const slogonRef = useRef();
  const titleLabelRef = useRef();
  const authorLabelRef = useRef();
  const fontLabelRef = useRef();
  const fontSizeLabelRef = useRef();
  const previewBtnRef = useRef();
  const generateBtnRef = useRef();

  const fontMap = new Map([
    ["如花似梦行楷", "RHSMXK"],
    ["一叶知秋行楷", "SJyiyezhiqiuxingkai"],
    ["望春风楷书", "YEFONTWangChunFengKaiShu"],
  ]);

  useEffect(() => {
    var canvas = document.getElementById("canvas");
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px " + fontMap.get(font);
    ctx.strokeStyle = "red";
    ctx.globalAlpha = 0.4;

    let characterPerRow = Math.round(canvas.width / (fontSize + 3));
    let contentArr = previewText.split("\n");
    for (let i = 0; i < contentArr.length; i++) {
      contentArr[i] = "  " + contentArr[i];
    }

    let linesToDraw = [title, author, ""];
    let count = 3;
    let pattern = new RegExp(`.{1,${characterPerRow}}`, "g");

    for (let i = 0; i < contentArr.length; i++) {
      if (contentArr[i].length > characterPerRow) {
        let tmp = contentArr[i].match(pattern);
        // eslint-disable-next-line no-loop-func
        tmp.forEach((e) => {
          linesToDraw[count++] = e;
        });
      } else linesToDraw[count++] = contentArr[i];
    }

    for (let i = 0; i < linesToDraw.length; i++) {
      for (let j = 0; j < characterPerRow; j++) {
        let x = j * fontSize + 40;
        let y = i * fontSize + 30;
        if (linesToDraw[i][j] === undefined) {
          // Draw text boxes only
          // Top left to bot right
          drawDashedLine(ctx, [x, y], [x + fontSize, y + fontSize]);
          // Top right to bot left
          drawDashedLine(ctx, [x + fontSize, y], [x, y + fontSize]);
          // Top to bot
          drawDashedLine(
            ctx,
            [x + Math.round(fontSize / 2), y],
            [x + Math.round(fontSize / 2), y + fontSize]
          );
          // Left to right
          drawDashedLine(
            ctx,
            [x, y + Math.round(fontSize / 2)],
            [x + fontSize, y + Math.round(fontSize / 2)]
          );
          ctx.setLineDash([]);
          // Outer rectangle
          ctx.strokeRect(x, y, fontSize, fontSize);
        } else {
          // Draw text and the text box
          ctx.fillText(linesToDraw[i][j], x, y + fontSize * 0.9);

          drawDashedLine(ctx, [x, y], [x + fontSize, y + fontSize]);
          drawDashedLine(ctx, [x + fontSize, y], [x, y + fontSize]);
          drawDashedLine(
            ctx,
            [x + Math.round(fontSize / 2), y],
            [x + Math.round(fontSize / 2), y + fontSize]
          );
          drawDashedLine(
            ctx,
            [x, y + Math.round(fontSize / 2)],
            [x + fontSize, y + Math.round(fontSize / 2)]
          );
          ctx.setLineDash([]);
          ctx.strokeRect(x, y, fontSize, fontSize);
        }
      }
    }
    previewTextRef.current.value = previewText;
  }, [previewText, font, fontSize]);

  useEffect(() => {
    if (language === "中文") {
      headerRef.current.innerText = "字帖生成器";
      slogonRef.current.innerText = "一起来练字！";
      titleLabelRef.current.innerText = "标题：";
      authorLabelRef.current.innerText = "作者：";
      fontLabelRef.current.innerText = "选择字体：";
      fontSizeLabelRef.current.innerText = "输入字号：";
      previewBtnRef.current.innerText = "预览";
      generateBtnRef.current.innerText = "生成";
    } else if (language === "English") {
      headerRef.current.innerText = "Calligraphy Practice Generator";
      slogonRef.current.innerText = "All for better handwriting!";
      titleLabelRef.current.innerText = "Title: ";
      authorLabelRef.current.innerText = "Author: ";
      fontLabelRef.current.innerText = "Select Font: ";
      fontSizeLabelRef.current.innerText = "Enter Font Size: ";
      previewBtnRef.current.innerText = "Preview";
      generateBtnRef.current.innerText = "Generate";
    }
  }, [language]);

  const generatePreview = () => {
    setTitle(titleRef.current.value);
    setAuthor(authorRef.current.value);
    setPreviewText(contentRef.current.value);
    setFont(fontRef.current.value);
    setFontSize(+fontSizeRef.current.value);
  };

  const saveAsPDF = () => {
    var dataUrl = document.getElementById("canvas").toDataURL(); //attempt to save base64 string to server using this var
    var windowContent = "<!DOCTYPE html>";
    windowContent += "<html>";
    windowContent += "<head><title>Print canvas</title></head>";
    windowContent += "<body>";
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += "</body>";
    windowContent += "</html>";
    var printWin = window.open("", "", "");
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.print();
  };

  const drawDashedLine = (ctx, start, end) => {
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };

  const languageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controlPanelContainer}>
        <h2 ref={headerRef}>字帖生成器</h2>
        <p ref={slogonRef}>一起来练字！</p>
        <fieldset>
          <legend>Select display language:</legend>
          <div>
            <input
              type="radio"
              name="lang"
              value="中文"
              onChange={languageChange}
              checked={language === "中文"}
            />
            <label>中文</label>
            <input
              type="radio"
              name="lang"
              value="English"
              onChange={languageChange}
              checked={language === "English"}
            />
            <label>English</label>
          </div>
        </fieldset>
        <div className={styles.titleDiv}>
          <label htmlFor="title" ref={titleLabelRef}>
            标题:
          </label>
          <input ref={titleRef} type="text" />
        </div>
        <div className={styles.authorDiv}>
          <label htmlFor="author" ref={authorLabelRef}>
            作者:
          </label>
          <input ref={authorRef} type="text" />
        </div>
        <textarea className={styles.inputBox} ref={contentRef} />
        <div className={styles.fontSelectionDiv}>
          <label htmlFor="font" ref={fontLabelRef}>
            选择字体：
          </label>
          <select name="fontSelect" id="fonts" ref={fontRef}>
            <option>如花似梦行楷</option>
            <option>一叶知秋行楷</option>
            <option>望春风楷书</option>
          </select>
        </div>
        <div className={styles.fontSizeDiv}>
          <label htmlFor="fontSize" ref={fontSizeLabelRef}>
            输入字号：
          </label>
          <input
            ref={fontSizeRef}
            type="text"
            className={styles.fontSizeInput}
          />
        </div>
        <button
          className={styles.generateBtn}
          onClick={generatePreview}
          ref={previewBtnRef}
        >
          预览
        </button>
        <button
          className={styles.generateBtn}
          onClick={saveAsPDF}
          ref={generateBtnRef}
        >
          生成
        </button>
      </div>
      <canvas className={styles.displayCanvasContainer} id="canvas">
        <p ref={previewTextRef}>{previewText}</p>
      </canvas>
    </div>
  );
}

export default App;
