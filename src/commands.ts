import * as vscode from "vscode";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { TempDir } from "./constant";

const os = require("os");

// 取得整行內容
const getCurrentLineContent = () => {
  const editor = vscode.window.activeTextEditor;
  const currentPosition = editor?.selection.active;
  return editor?.document.lineAt(currentPosition?.line ?? -1)?.text ?? "";
};

// GPT: 覆蓋當前行內容
const replaceCurrentLineContent = (newText: string) => {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;
  const currentLine = editor?.document.lineAt(selection?.active.line ?? 0);
  if (!editor || !currentLine) {
    return;
  }
  // 构建要替换的范围
  const replaceRange = new vscode.Range(
    currentLine?.range.start!,
    currentLine?.range.end!
  );
  // 创建一个编辑操作
  const edit = new vscode.WorkspaceEdit();
  // 用新的内容替换整行的文本
  edit.replace(editor!.document.uri, replaceRange, newText);
  // 应用编辑操作
  vscode.workspace.applyEdit(edit);
};

export const TailwindcssCommand = vscode.commands.registerCommand(
  "apply2css.apply",
  async () => {
    // 是否為斜線開頭
    const currentLineContent = getCurrentLineContent();
    if (!/^(\s+)?(\/\/|@apply)/.test(currentLineContent.trim())) {
      return;
    }

    // 獲取 tabSize 設定
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const configuration = vscode.workspace.getConfiguration(
      "editor",
      editor.document.uri
    );
    const tabSize: number = configuration.get("tabSize") ?? 4;

    // 保存縮排數量
    const indentSpaces = Math.floor(
      (currentLineContent.match(/^([\s])+/)?.[0] ?? "").split("").length /
        tabSize
    );

    // 臨時文件暫存內容
    const tmpContent = [
      ".tmp {",
      currentLineContent.replace(/\/\//, "@apply"),
      "}",
    ];
    const tempFile = path.join(TempDir, "tmp.css");
    await fs.promises.writeFile(tempFile, tmpContent.join("\n"));

    // CLI
    try {
      // spwan options
      const settingNodePath: string =
        vscode.workspace?.getConfiguration("apply2css")?.get("node") ?? "";
      const spwanOptions = !settingNodePath
        ? undefined
        : {
            env: {
              PATH: settingNodePath,
            },
          };
      // cli options
      const settingTailwindConfigPath: string =
        vscode.workspace
          ?.getConfiguration("apply2css")
          ?.get("tailwindcss-config") ?? "";

      const cliOptions = ["-i", tempFile];
      if (settingTailwindConfigPath) {
        cliOptions.push("-c", settingTailwindConfigPath);
      }

      const child = spawn("tailwindcss", cliOptions, spwanOptions);
      let tailwindOutput: string = await new Promise((resolve, reject) => {
        // 監聽 child process 的 error 事件
        child.on("error", (error: any) => reject(error));
        child.stdout.on("data", (data) =>
          resolve(Buffer.from(data).toString("utf-8"))
        );
      });

      // 過濾 .tmp {}
      const pattern = /\.tmp\s*{([^}]*)}/g;
      const matches = tailwindOutput.match(pattern);
      if (matches) {
        matches.forEach(function (match) {
          tailwindOutput = tailwindOutput.replace(
            match,
            match.replace(/\.tmp\s*{([^}]*)}/g, "$1")
          );
        });
      }

      // 覆蓋 variable TODO
      const varPattern = /^(\s+)?--.*[a-z0-9_-]/gm;
      const varMatches = tailwindOutput.match(varPattern);
      if (varMatches) {
        varMatches.forEach(function (match) {
          const [key = "", value = ""] = match.trim().split(":") ?? [];
          tailwindOutput = tailwindOutput
            .replaceAll(`var(${key.trim()})`, value.trim())
            .replaceAll(match.trim(), "");
        });
      }

      // 每一行最後加上分號
      const matchRes = tailwindOutput
        // 刪掉換行開頭
        ?.replace(/^\n|\n$/gm, "")
        // 刪除單行只有;的行
        ?.replace(/^[\s;]*[\r\n]+/gm, "")
        // 刪除 variable 找不到參數的設定
        ?.replace(/var\([^)]*\)/g, "0")
        // 刪除 .tmp > 的 .tmp
        ?.replace(/\.tmp\s>/, ">")
        // 最後加上分號
        ?.replace(/(.*?[^{};\s])$/gm, "$1;")
        // 減少縮排
        ?.replace(/^( {2})/gm, " ".repeat(tabSize * indentSpaces));

      replaceCurrentLineContent(matchRes);
    } catch (error) {
      vscode.window.showInformationMessage(String(error));
    }
  }
);
