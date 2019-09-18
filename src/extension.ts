'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TypescriptParser, DefaultDeclaration } from 'typescript-parser';
import { promisify } from 'util';


import * as glob from "glob";
import { dirname, join } from "path";
const promiseGlob = promisify(glob);

const INDEX_PATH = "index.ts";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Importall extension activated!');

    let provider1 = vscode.languages.registerCompletionItemProvider('typescript', {

        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

            const dirPath = dirname(document.uri.fsPath);
            const allFilesInPath = await promiseGlob(`${dirPath}/*.ts*`);
            const ignorePaths = [join(dirPath, INDEX_PATH), document.uri.fsPath];
            const filesInPath = allFilesInPath.filter(f => !ignorePaths.some(p => p === f));

            const parser = new TypescriptParser();

            const declarations = await Promise.all(filesInPath.map(fp => {
                return parser.parseFile(fp, "./");
            }));

            const importText = declarations.map(f => {
                if (!f.declarations || f.declarations.length === 0) {
                    return "";
                }
                const exportedDeclarations = f.declarations.filter((f: any) => f.isExported);
                if (exportedDeclarations.length === 0) {
                    return "";
                }
                return `import { ${exportedDeclarations.map(d => {
                    if (d instanceof DefaultDeclaration) {
                        return `default as ${d.name}`;
                    }
                    return d.name;
                }).join(", ")} } from "./${f.parsedPath.name}";`;
            }).join("\n");

            const importAllCompletion = new vscode.CompletionItem('Import all from current directory');
            importAllCompletion.insertText = importText;

            const exportText = declarations.map(f => {
                if (!f.declarations || f.declarations.length === 0) {
                    return "";
                }
                const exportedDeclarations = f.declarations.filter((f: any) => f.isExported);
                if (exportedDeclarations.length === 0) {
                    return "";
                }
                return `export { ${exportedDeclarations.map(d => {
                    if (d instanceof DefaultDeclaration) {
                        return `default as ${d.name}`;
                    }
                    return d.name;
                }).join(", ")} } from "./${f.parsedPath.name}";`;
            }).join("\n");

            const exportAllCompletion = new vscode.CompletionItem('Export all from current directory');
            exportAllCompletion.insertText = exportText;

            return [
                importAllCompletion,
                exportAllCompletion
            ];
        }
    });

    context.subscriptions.push(provider1);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
