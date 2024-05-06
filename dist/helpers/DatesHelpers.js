"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDates = void 0;
const compareDates = (firstDate, secondDate) => (firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate());
exports.compareDates = compareDates;
