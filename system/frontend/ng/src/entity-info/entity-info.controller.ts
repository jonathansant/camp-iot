import {ClipBoard} from "angular-clipboard";

export class EntityInfoController {

    constructor(private clipboard: ClipBoard) {
        "ngInject";
    }

    copyToClipboard(data: string): void {
        this.clipboard.copyText(data);
    }
}