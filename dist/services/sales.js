"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSale = exports.updateSale = exports.getSaleById = exports.getSales = exports.createSale = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const redis_1 = require("../services/redis");
const SALES_CHANNEL = 'sales-updates';
const createSale = async (data) => {
    const totalAmount = data.quantity * data.price;
    const sale = await prisma_1.default.sales.create({
        data: {
            ...data,
            totalAmount
        }
    });
    await (0, redis_1.publish)(SALES_CHANNEL, { type: 'CREATE', data: sale });
    return sale;
};
exports.createSale = createSale;
const getSales = async () => {
    return prisma_1.default.sales.findMany({
        orderBy: { createdAt: 'desc' }
    });
};
exports.getSales = getSales;
const getSaleById = async (id) => {
    return prisma_1.default.sales.findUnique({
        where: { id }
    });
};
exports.getSaleById = getSaleById;
const updateSale = async (data) => {
    const { id, ...updateData } = data;
    const sale = await prisma_1.default.sales.update({
        where: { id },
        data: {
            ...updateData,
            totalAmount: updateData.quantity && updateData.price
                ? updateData.quantity * updateData.price
                : undefined
        }
    });
    await (0, redis_1.publish)(SALES_CHANNEL, { type: 'UPDATE', data: sale });
    return sale;
};
exports.updateSale = updateSale;
const deleteSale = async (id) => {
    const sale = await prisma_1.default.sales.delete({
        where: { id }
    });
    await (0, redis_1.publish)(SALES_CHANNEL, { type: 'DELETE', data: { id } });
    return sale;
};
exports.deleteSale = deleteSale;
