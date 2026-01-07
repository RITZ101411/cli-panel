import * as vscode from 'vscode';
import { CliPanelProvider } from './cliPanelProvider';

export function activate(context: vscode.ExtensionContext) {
    const provider = new CliPanelProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('cliPanel', provider)
    );
}

export function deactivate() {}
