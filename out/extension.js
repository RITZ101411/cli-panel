"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const cliPanelProvider_1 = require("./cliPanelProvider");
function activate(context) {
    const provider = new cliPanelProvider_1.CliPanelProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('cliPanel', provider));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map