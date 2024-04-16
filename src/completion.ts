import * as vscode from "vscode";
import { TailwindcssKeywords } from "./constant";

// 提示文字
class CommentCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    if (!/\/\/|@apply/.test(document.lineAt(position).text?.trim())) {
      return undefined;
    }
    return TailwindcssKeywords;
  }
}

export const TailwindcssKeywordCompletion =
  vscode.languages.registerCompletionItemProvider(
    { scheme: "file" },
    new CommentCompletionItemProvider(),
    "/",
    " "
  );
