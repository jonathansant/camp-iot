export class CampModel {
    _id: any;
}

export interface BusinessError {
    property: string;
    errorCode?: number;
    errorName: string;
    value?: any;
}