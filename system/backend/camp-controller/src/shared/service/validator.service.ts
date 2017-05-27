import {BusinessError} from "./../model/common.model";

export interface IValidator {
    validate(model: any): BusinessError[];
    sanitize(model: any): BusinessError[];
}