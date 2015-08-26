/// <amd-dependency path="text!res/xsdschema.xsd" name="xsdXml"/>
import { XmlDocument, XmlElement } from "model/xml"

declare const xsdXml: string;
const xsd = "http://www.w3.org/2001/XMLSchema";

export class XsdSchemaSet {

    private _map: { [key: string]: XsdSchema };

    constructor() {

        this._map = Object.create(null);
        this.add(xsdXml);
    }

    add(xml: string) {
        
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        const schema = new XsdSchema(new XmlDocument(doc).root, this.at);
        this._map[`.${schema.ns}`] = schema;
    }

    at(ns: string) {
        return this._map[`.${ns}`];
    }
}

type XsdComplexModel = XsdGroup | XsdContent;

export class XsdComplexType {

    private _model: XsdComplexModel;
     
    constructor(private _root: XmlElement, private _at: (ns: string) => XsdSchema) {
    }

    get name() {
        return this._root.at("name");
    }

    get model() {

        if (!this._model) {

            const [seq, choice, all, content] = this._root.any(xsd, "sequence", "choice", "all", "complexContent");
            this._model = (content && new XsdContent(content, this._at)) || new XsdGroup(seq || choice || all);
        }

        return this._model;
    }
}

export class XsdSimpleType {

    constructor(private _root: XmlElement) {
    }

    get name() {
        return this._root.at("name");
    }
}

type XsdType = XsdComplexType | XsdSimpleType;

export class XsdSchema {

    private _roots: XsdElement[];
    private _rootIndex: { [key: string]: XsdElement };

    private _simpleTypes: XsdSimpleType[];
    private _simpleIndex: { [key: string]: XsdSimpleType };

    private _complexTypes: XsdComplexType[];
    private _complexIndex: { [key: string]: XsdComplexType };

    constructor(private _root: XmlElement, at: (ns: string) => XsdSchema) {

        this._rootIndex = Object.create(null);
        this._roots = this._root.all(xsd, "element").map(root => {

            const element = new XsdElement(root, at);
            this._rootIndex[element.name] = element;
            return element;
        });

        this._simpleIndex = Object.create(null);
        this._simpleTypes = this._root.all(xsd, "simpleType").map(root => {

            const type = new XsdSimpleType(root);
            this._simpleIndex[type.name] = type;
            return type;
        });

        this._complexIndex = Object.create(null);
        this._complexTypes = this._root.all(xsd, "complexType").map(root => {

            const type = new XsdComplexType(root, at);
            this._complexIndex[type.name] = type;
            return type;
        });
    }

    get ns() {
        return this._root.at("targetNamespace");
    }

    complexType(name: string) {
        return this._complexIndex[name];
    }

    simpleType(name: string) {
        return this._simpleIndex[name];
    }

    element(name: string) {
        return this._rootIndex[name];
    }
    
    get roots() {
        return this._roots;
    }
}

export class XsdElement {

    private _type: XsdType;

    constructor(private _root: XmlElement, private _at: (ns: string) => XsdSchema) {
    }

    get name() {
        return this._root.at("name");
    }

    get type() {

        if (!this._type) {

            const [ct, st] = this._root.any(xsd, "complexType", "simpleType");
            this._type = (ct && new XsdComplexType(ct, this._at)) || (st && new XsdSimpleType(st));
        }

        return this._type;
    }
}

export class XsdGroup {

    constructor(private _root: XmlElement) {
    }

    get kind() {
        return this._root.name;
    }
}

export class XsdContent {

    private _base: XsdComplexType;

    constructor(private _root: XmlElement, private _at: (ns: string) => XsdSchema) {
    }

    get base() {

        if (!this._base) {

            const [extension] = this._root.any(xsd, "extension");
            const [ns, name] = extension.unat("base");
            this._base = this._at(ns).complexType(name);
        }

        return this._base;
    }
}

export class XsdRestriction {

    constructor(private _root: XmlElement) {
    }
}