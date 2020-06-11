import * as vscode from 'vscode';
import { importall, getParsedFiles } from "./importall";
import { ignoreGlobs } from "./ignoreGlobs";

export function activate(context: vscode.ExtensionContext) {

    const completionItemProvider = vscode.languages.registerCompletionItemProvider(["typescript", "typescriptreact"], {

        async provideCompletionItems(document: vscode.TextDocument) {

            const parsedFiles = await getParsedFiles({
                filePath: document.uri.fsPath,
                ignoreGlobs,
            });

            const importAllText = importall({ importKeyword: "import", parsedFiles });
            const importAllCompletion = new vscode.CompletionItem('Import all from current directory');
            importAllCompletion.insertText = importAllText;

            const exportAllText = importall({ importKeyword: "export", parsedFiles });
            const exportAllCompletion = new vscode.CompletionItem('Export all from current directory');
            exportAllCompletion.insertText = exportAllText;

            return [
                importAllCompletion,
                exportAllCompletion
            ];
        }
    });

    context.subscriptions.push(completionItemProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
