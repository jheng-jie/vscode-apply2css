import * as vscode from "vscode";
import keywords from "./keywords.json";
import fs from "fs";
import path from "path";

const os = require("os");

// 字首分類
export const TailwindcssKeywords =
  Object.keys(keywords).map((key) => {
    return new vscode.CompletionItem(
      {
        label: key,
        detail: "",
        description: keywords[key as keyof typeof keywords],
      },
      vscode.CompletionItemKind.Keyword
    );
  }) ?? [];

// 暫存目錄
export const TempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "vscode-apply2css")
);
