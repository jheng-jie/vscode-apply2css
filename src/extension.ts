import * as vscode from "vscode";
import { TailwindcssKeywordCompletion } from "./completion";
import { TailwindcssCommand } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("Apply2CSS is Work");
  // 快捷鍵
  context.subscriptions.push(TailwindcssCommand);
  // 自動完成提示
  context.subscriptions.push(TailwindcssKeywordCompletion);
}

// This method is called when your extension is deactivated
export function deactivate() {}
