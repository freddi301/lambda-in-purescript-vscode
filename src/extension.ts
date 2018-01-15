'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const lip = require('lambda-in-purescript/output/Lambda.Parser.Parser')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "lambda-in-purescript-vscode" is now active!');
    
    let disposable = vscode.languages.registerDocumentFormattingEditProvider('lambda-in-purescript', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {

            const result = lip.prettify(document.getText());
            if (result) {
                return [
                    vscode.TextEdit.delete(new vscode.Range(0, 0, 10000, 10000)),
                    vscode.TextEdit.insert(new vscode.Position(0,0), result)
                ]
            }

        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}