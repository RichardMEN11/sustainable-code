// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'sustainable-code.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello from Richard');
    }
  );

  context.subscriptions.push(disposable);

  // Create a webview panel
  const panel = vscode.window.createWebviewPanel(
    'sustainableCode',
    'Sustainable Code',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  // Get the path to the bundled React HTML file
  const bundlePath = path.join(
    context.extensionPath,
    'src/view/dist',
    'index.html'
  );

  const htmlContent = fs.readFileSync(bundlePath, 'utf8');

  panel.webview.html = htmlContent;

  console.log(panel.webview.html);

  panel.reveal(vscode.ViewColumn.One);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(bundlePath: vscode.Uri) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Extension</title>
    </head>
    <body>
      <iframe src="${bundlePath}" frameborder="0"></iframe>
    </body>
    </html>
  `;
}
