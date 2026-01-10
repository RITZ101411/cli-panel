import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';

interface Message {
    type: string;
    data?: any;
}

export function activate(context: vscode.ExtensionContext) {
    const provider = new CLIPanelViewProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('cliPanel', provider)
    );
}

class CLIPanelViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _cliProcess?: ChildProcess;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'out', 'webview')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((message: Message) => {
            this._handleMessage(message);
        });
    }

    private _handleMessage(message: Message) {
        switch (message.type) {
            case 'sendPrompt':
                this._executeCLI(message.data.text);
                break;
            case 'stopProcess':
                this._stopCLI();
                break;
        }
    }

    private _executeCLI(command: string) {
        if (this._cliProcess) {
            this._cliProcess.kill();
        }

        const [cmd, ...args] = command.trim().split(' ');
        this._cliProcess = spawn(cmd, args, {
            cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
            shell: true
        });

        this._cliProcess.stdout?.on('data', (data) => {
            this._sendToWebview('output', { text: data.toString(), type: 'stdout' });
        });

        this._cliProcess.stderr?.on('data', (data) => {
            this._sendToWebview('output', { text: data.toString(), type: 'stderr' });
        });

        this._cliProcess.on('close', (code) => {
            this._sendToWebview('processEnd', { code });
            this._cliProcess = undefined;
        });

        this._cliProcess.on('error', (error) => {
            this._sendToWebview('error', { message: error.message });
            this._cliProcess = undefined;
        });
    }

    private _stopCLI() {
        if (this._cliProcess) {
            this._cliProcess.kill();
            this._cliProcess = undefined;
            this._sendToWebview('processStopped', {});
        }
    }

    private _sendToWebview(type: string, data?: any) {
        if (this._view) {
            this._view.webview.postMessage({ type, data });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'index.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'index.css'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>CLI Panel</title>
            </head>
            <body>
                <div id="root"></div>
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

export function deactivate() {}
