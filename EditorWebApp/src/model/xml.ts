export class XmlDocument {

    constructor(private _node: XMLDocument) {
        
    }

    get root() {
        return new XmlElement(this._node.documentElement);
    }
}

export class XmlElement {

    constructor(private _node: HTMLElement) {
        
    }

    get ns() {
        return this._node.namespaceURI;
    }

    get name() {
        return this._node.localName;
    }

    get value() {
        return this._node.textContent;
    }
    
    at(name: string) {
        
        const result = this._node.getAttribute(name);
        return result === null ? void 0 : result;
    };

    unat(name: string) {

        const value = this.at(name);
        const parts = value && value.split(":", 2);
        const ns = parts && (parts[1] ? this._node.lookupNamespaceURI(parts[0]) : this.ns);
        return ns && [ns, parts.pop()];
    }

    
    all(ns: string, ...names: string[]) {

        const result: XmlElement[] = [];
        this.each(ns, names, element => {

            result.push(element);
            return true;
        });
        return result;
    }

    any(ns: string, ...names: string[]) {

        const result = new Array<XmlElement>(names.length);
        this.each(ns, names, element => {

            const index = names.indexOf(element.name);
            if (index !== -1) {
                result[index] = element;
                return false;
            }
        });
        return result;
    }

    private each(ns: string, names: string[], fn: (element: XmlElement) => boolean) {

        let stop = false;
        for(let i = 0, n = names.length; !stop && i < n; i++) {

            const nodes = this._node.getElementsByTagNameNS(ns, names[i]);
            for (let j = 0, m = nodes.length; !stop && j < m; j++) {

                if (nodes[j].parentNode === this._node) {

                    stop = !fn(new XmlElement(<HTMLElement>nodes[j]));
                }
            }
        }
    }
}