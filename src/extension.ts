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

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "importall" is now active!');

    let provider1 = vscode.languages.registerCompletionItemProvider('typescript', {

        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

            const dirPath = dirname(document.uri.fsPath);
            const allFilesInPath = (await promiseGlob(`${dirPath}/*.ts`));
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

            const exportAllCompletion = new vscode.CompletionItem('export all from current directory');
            exportAllCompletion.insertText = exportText;

            // // a simple completion item which inserts `Hello World!`
            // const simpleCompletion = new vscode.CompletionItem('Hello World!');

            // // a completion item that inserts its text as snippet,
            // // the `insertText`-property is a `SnippetString` which we will
            // // honored by the editor.
            // const snippetCompletion = new vscode.CompletionItem('Good part of the day');
            // snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
            // snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

            // // a completion item that can be accepted by a commit character,
            // // the `commitCharacters`-property is set which means that the completion will
            // // be inserted and then the character will be typed.
            // const commitCharacterCompletion = new vscode.CompletionItem('console');
            // commitCharacterCompletion.commitCharacters = ['.'];
            // commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

            // // a completion item that retriggers IntelliSense when being accepted,
            // // the `command`-property is set which the editor will execute after 
            // // completion has been inserted. Also, the `insertText` is set so that 
            // // a space is inserted after `new`
            // const commandCompletion = new vscode.CompletionItem('new');
            // commandCompletion.kind = vscode.CompletionItemKind.Keyword;
            // commandCompletion.insertText = 'new ';
            // commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

            // return all completion items as array
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