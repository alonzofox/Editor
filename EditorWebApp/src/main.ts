/// <amd-dependency path="domReady!"/>
/// <amd-dependency path="text!edit-view/edit-view.html" name="editView"/>
import ko = require("knockout")
import EditView from "edit-view/edit-view"

declare const editView: string;
ko.components.register("edit-view", { viewModel: EditView, template: editView });

ko.applyBindings();