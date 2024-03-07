"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlan = void 0;
const Message_1 = require("../enums/Message");
const updatePlan = (plan, daysCount, days) => __awaiter(void 0, void 0, void 0, function* () {
    if (daysCount === 1) {
        yield plan.updateOne({ planA: days[0].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else if (daysCount === 2) {
        yield plan.updateOne({ planA: days[0].exercises, planB: days[1].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else if (daysCount === 3) {
        yield plan.updateOne({ planA: days[0].exercises, planB: days[1].exercises, planC: days[2].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else if (daysCount === 4) {
        yield plan.updateOne({ planA: days[0].exercises, planB: days[1].exercises, planC: days[2].exercises, planD: days[3].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else if (daysCount === 5) {
        yield plan.updateOne({ planA: days[0].exercises, planB: days[1].exercises, planC: days[2].exercises, planD: days[3].exercises, planE: days[4].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else if (daysCount === 6) {
        yield plan.updateOne({ planA: days[0].exercises, planB: days[1].exercises, planC: days[2].exercises, planD: days[3].exercises, planE: days[4].exercises, planF: days[5].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else if (daysCount === 7) {
        yield plan.updateOne({ planA: days[0].exercises, planB: days[1].exercises, planC: days[2].exercises, planD: days[3].exercises, planE: days[4].exercises, planF: days[5].exercises, planG: days[6].exercises });
        return { msg: Message_1.Message.Updated };
    }
    else {
        return { msg: Message_1.Message.TryAgain };
    }
});
exports.updatePlan = updatePlan;
