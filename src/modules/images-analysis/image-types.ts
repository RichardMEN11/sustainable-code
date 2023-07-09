import * as vscode from 'vscode';

const getNumberOfPngFiles = async (): Promise<number> => {
  const files = await vscode.workspace.findFiles('**/*.png');

  return files.length;
};
