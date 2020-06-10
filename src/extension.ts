import * as vscode from 'vscode';
import { importall } from "./importall";
import { ignoreGlobs } from "./ignoreGlobs";

const IMPORT_ALL_COMMAND = "importall.import-all";
const EXPORT_ALL_COMMAND = "importall.export-all";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('importall extension activated!');

    const completionItemProvider = vscode.languages.registerCompletionItemProvider(["typescript", "typescriptreact"], {

        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

            const importAllText = await importall({
                filePath: document.uri.fsPath,
                ignoreGlobs,
                importKeyWord: "import"
            });

            const exportAllText = await importall({
                filePath: document.uri.fsPath,
                ignoreGlobs,
                importKeyWord: "export"
            });

            const importAllCompletion = new vscode.CompletionItem('Import all from current directory');
            importAllCompletion.insertText = importAllText;

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
