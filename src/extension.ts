"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  TextDocument,
  CancellationToken,
  CodeLens,
  HoverProvider,
  Position,
  Hover,
  ExtensionContext,
  languages,
  TextEdit,
  Range,
  CodeLensProvider,
  DocumentFormattingEditProvider
} from "vscode";

import * as LambdaParserParser from "../lambda-in-purescript/output/Lambda.Parser.Parser";
import * as LambdaDataAst from "../lambda-in-purescript/output/Lambda.Data.Ast";

const LIP_MODE = "lambda-in-purescript";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "lambda-in-purescript-vscode" is now active!'
  );

  context.subscriptions.push(
    languages.registerDocumentFormattingEditProvider(
      LIP_MODE,
      new LipDocumentFormattingEditProvider()
    )
  );

  context.subscriptions.push(
    languages.registerCodeLensProvider(LIP_MODE, new LipCodeLensProvider())
  );

  context.subscriptions.push(
    languages.registerHoverProvider(LIP_MODE, new LipHoverProvider())
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

class LipDocumentFormattingEditProvider
  implements DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
    const result = LambdaParserParser.prettify(document.getText());
    if (result) {
      return [
        TextEdit.delete(new Range(0, 0, 10000, 10000)),
        TextEdit.insert(new Position(0, 0), result)
      ];
    }
  }
}

class LipCodeLensProvider implements CodeLensProvider {
  public provideCodeLenses(
    document: TextDocument,
    token: CancellationToken
  ): CodeLens[] | Thenable<CodeLens[]> {
    return [
      new CodeLens(document.lineAt(0).range, { title: "fakelens", command: "" })
    ];
  }

  public resolveCodeLens?(
    codeLens: CodeLens,
    token: CancellationToken
  ): CodeLens | Thenable<CodeLens> {
    return codeLens;
  }
}

class LipHoverProvider implements HoverProvider {
  public provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Thenable<Hover> {
    const text = document.getText();
    const program = LambdaParserParser.parseProgram(text);
    const sourced = LambdaParserParser.getSourceMap(program)(position.character);
    const prettyPrinted = sourced.map(item => LambdaDataAst.prettyPrint(item.value0));
    return Promise.resolve(
      new Hover([
        ...prettyPrinted,
        "simple text",
        { language: "lambda-in-purescript", value: "fake hover = this" }
      ])
    );
  }
}
