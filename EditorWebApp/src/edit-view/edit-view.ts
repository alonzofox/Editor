import ko = require("knockout")

export default class EditView {

    public title: KnockoutObservable<string>;

    constructor({ title }: { title: string }) {

        this.title = ko.observable(title);
    }
}