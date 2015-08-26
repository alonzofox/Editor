/// <amd-dependency path='text!res/content.xsd' name='contentXsd'/>
import ko = require("knockout")
import { XsdSchemaSet, XsdElement } from "model/xsd"

declare const contentXsd: string;

export default class EditView {

    public roots: KnockoutObservableArray<XsdElement>;

    constructor({ title }: { title: string }) {

        const schemas = new XsdSchemaSet();
        schemas.add(contentXsd);
        this.roots = ko.observableArray(schemas.at("http://standards.daktronics.com/2015/control-system").roots);
    }
}