"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliPanelProvider = void 0;
class CliPanelProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'command':
                    // Handle command execution
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CLI Panel</title>
    <style>
        body {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            margin: 0;
            padding: 0;
            background: var(--vscode-panel-background);
            color: #fff;
            height: 100vh;
            overflow: hidden;
        }
        .terminal {
            height: calc(100vh - 30px);
            overflow-y: auto;
            padding: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #fff;
        }
        .input-line {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: var(--vscode-panel-background);
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            align-items: center;
            padding: 0 8px;
        }
        .prompt {
            color: #fff;
            margin-right: 5px;
        }
        input {
            flex: 1;
            background: transparent;
            border: none;
            color: #fff;
            font-family: inherit;
            font-size: inherit;
            outline: none;
        }
    </style>
</head>
<body>
    <div id="terminal" class="terminal"></div>
    <div class="input-line">
        <span class="prompt">></span>
        <input type="text" id="commandInput" />
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const terminal = document.getElementById('terminal');
        const input = document.getElementById('commandInput');

        function sendCommand() {
            const command = input.value;
            if (command) {
                terminal.innerHTML += '$ ' + command + '\n';
                vscode.postMessage({ type: 'command', text: command });
                input.value = '';
                terminal.scrollTop = terminal.scrollHeight;
            }
        }

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendCommand();
            }
        });

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'output':
                    terminal.innerHTML += message.text;
                    terminal.scrollTop = terminal.scrollHeight;
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}
exports.CliPanelProvider = CliPanelProvider;
CliPanelProvider.viewType = 'cliPanel';
//# sourceMappingURL=cliPanelProvider.js.map