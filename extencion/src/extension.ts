import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
  );
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Add Todo";
  item.command = "vstodo.addTodo";
  item.show();

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.addTodo", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text aditor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.helloWorld", () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.authenticate", () => {
      authenticate();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refresh", async () => {
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vstodo-sidebar-view"
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How do you feel bro?",
        "Good",
        "Bad"
      );
      if (answer === "Bad") {
        vscode.window.showInformationMessage("Sorry to hear that :(");
      } else {
        console.log({ answer });
      }
    })
  );
}

export function deactivate() {}
