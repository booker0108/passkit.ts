"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PassKit = require("./index");
const Format = require("dateformat");
/// Template
class Template {
    /// constructor
    constructor(style, pass, organizationName, description, serialNumber) {
        this.formatVersion = 1;
        this.passTypeIdentifier = PassKit.certtificates.options.passTypeIdentifier;
        this.teamIdentifier = PassKit.certtificates.options.teamIdentifier;
        this.organizationName = organizationName;
        this.description = description;
        this.serialNumber = serialNumber;
        switch (style) {
            case PassKit.Style.boardingPass: {
                this.boardingPass = pass;
                break;
            }
            case PassKit.Style.coupon: {
                this.coupon = pass;
                break;
            }
            case PassKit.Style.eventTicket: {
                this.eventTicket = pass;
                break;
            }
            case PassKit.Style.generic: {
                this.generic = pass;
                break;
            }
            case PassKit.Style.storeCard: {
                this.storeCard = pass;
                break;
            }
        }
    }
    validate() {
        // Required keys
        const requireKeys = [
            'description',
            'formatVersion',
            'organizationName',
            'passTypeIdentifier',
            'serialNumber',
            'teamIdentifier',
            'authenticationToken',
        ];
        for (const key of requireKeys) {
            if (!this[key]) {
                throw Error(`Missing ${key}, ${key} is required`);
            }
            if (key === 'authenticationToken') {
                if (this[key].length < 16) {
                    throw Error(`${key} must be 16 characters or longer.`);
                }
            }
        }
        // ATS
        if (this['webServiceURL']) {
            if (this['webServiceURL'].includes('http:')) {
                throw Error(`webServiceURL must use https. ${this['webServiceURL']}`);
            }
        }
    }
    toPass() {
        this.validate();
        const pass = {};
        for (const key in this) {
            const value = this[key];
            if (value instanceof PassKit.RGB) {
                pass[key] = value.getValue();
            }
            else if (value instanceof Date) {
                pass[key] = Format(value, 'isoUtcDateTime');
            }
            else {
                pass[key] = value;
            }
        }
        return pass;
    }
}
exports.default = Template;
//# sourceMappingURL=template.js.map