"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDbDesignerCommands = void 0;
const vscode = require("vscode");
const newDatabaseDialog_1 = require("../dialogs/newDatabaseDialog");
function registerDbDesignerCommands(client) {
    vscode.commands.registerCommand('mySql.createDatabase', () => __awaiter(this, void 0, void 0, function* () {
        return createNewDatabaseDialog(client);
    }));
}
exports.registerDbDesignerCommands = registerDbDesignerCommands;
function createNewDatabaseDialog(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let newDatabaseDialog = new newDatabaseDialog_1.NewDatabaseDialog(client);
        yield newDatabaseDialog.openDialog();
        return newDatabaseDialog;
    });
}

//# sourceMappingURL=dbDesigner.js.map
