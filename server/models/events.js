"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String },
    time: { type: String, required: true },
    description: { type: String, required: true }
});
const EventModel = mongoose_1.default.model('Event', eventSchema);
exports.default = EventModel;
//# sourceMappingURL=events.js.map