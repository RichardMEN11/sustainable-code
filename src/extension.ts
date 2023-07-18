'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const collection = vscode.languages.createDiagnosticCollection('test');
  if (vscode.window.activeTextEditor) {
    updateDiagnostics(vscode.window.activeTextEditor.document, collection);
    updateMemoryLeakDiagnostics(vscode.window.activeTextEditor.document);
  }
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        updateDiagnostics(editor.document, collection);
        updateMemoryLeakDiagnostics(editor.document);
      }
    })
  );
}

function updateDiagnostics(
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection
): void {
  if (document && document.fileName.endsWith('.tsx')) {
    const text = document.getText();
    const regex = /\.png/g;
    const diagnostics: vscode.Diagnostic[] = [];

    let match;
    while ((match = regex.exec(text)) !== null) {
      const diagnostic: vscode.Diagnostic = {
        code: '',
        message:
          'PNG image detected. Does it need to be an PNG? If you not need it please use a smaller image type like jpg or webp',
        range: new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + match[0].length)
        ),
        severity: vscode.DiagnosticSeverity.Information,
        source: 'sustainable-code',
      };

      diagnostics.push(diagnostic);
    }

    // Set the collected diagnostics for the document
    collection.set(document.uri, diagnostics);
  } else {
    collection.clear();
  }
}

function updateMemoryLeakDiagnostics(document: vscode.TextDocument): void {
  if (document && document.fileName.endsWith('.tsx')) {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const regex = /\bsetInterval\b/gi; // Word "interval" regex with global case-insensitive flag
    let match;

    while ((match = regex.exec(text)) !== null) {
      const diagnostic: vscode.Diagnostic = {
        code: '',
        message:
          'Interval is not cleared. - Resource waste, unnecessary execution.',
        range: new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + match[0].length)
        ),
        severity: vscode.DiagnosticSeverity.Information,
        source: 'Memory Leaks',
      };

      diagnostics.push(diagnostic);
    }

    vscode.languages
      .createDiagnosticCollection('MemoryLeaks')
      .set(document.uri, diagnostics);
  }
}
