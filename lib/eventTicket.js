"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PassKit = require("./index");
const template_1 = require("./template");
class EventTicket extends template_1.default {
    constructor(pass, organizationName, description, serialNumber) {
        super(PassKit.Style.eventTicket, pass, organizationName, description, serialNumber);
    }
}
exports.default = EventTicket;
//# sourceMappingURL=eventTicket.js.map