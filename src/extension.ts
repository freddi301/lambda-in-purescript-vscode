'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextDocument, CancellationToken, CodeLens, HoverProvider, Position, Hover } from 'vscode';

const lip = require('lambda-in-purescript/output/Lambda.Parser.Parser')

const LIP_MODE = "lambda-in-purescript";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "lambda-in-purescript-vscode" is now active!');

    context.subscriptions.push(formatFile);

    context.subscriptions.push(vscode.languages.registerCodeLensProvider(LIP_MODE, new LipCodeLensProvider()));

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            LIP_MODE, new LipHoverProvider()));

}

// this method is called when your extension is deactivated
export function deactivate() {
}

const formatFile = vscode.languages.registerDocumentFormattingEditProvider('lambda-in-purescript', {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {

        const result = lip.prettify(document.getText());
        if (result) {
            return [
                vscode.TextEdit.delete(new vscode.Range(0, 0, 10000, 10000)),
                vscode.TextEdit.insert(new vscode.Position(0, 0), result)
            ]
        }

    }
});

class LipCodeLensProvider implements vscode.CodeLensProvider {
    public provideCodeLenses(document: TextDocument, token: CancellationToken):
        CodeLens[] | Thenable<CodeLens[]> {
        // TODO: implement lenses here
        return [new vscode.CodeLens(document.lineAt(1).range, { title: "fakelens", command: "" })]
    }

    public resolveCodeLens?(codeLens: CodeLens, token: CancellationToken):
        CodeLens | Thenable<CodeLens> {
        return codeLens
    }
}

class LipHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument, position: Position, token: CancellationToken):
        Thenable<Hover> {
        return Promise.resolve(new Hover(["simple text", { language: "lambda-in-purescript", value: "fake hover = this" }]));
    }
}