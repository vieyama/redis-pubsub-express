import prisma from '../utils/prisma';
import { CreateSalesInput, UpdateSalesInput, Sales } from '../types/sales';
import { publish } from '../services/redis';
import { redis } from '../utils/redis';
import { safeDel, safeGet, safeSet } from '../utils/redisCache';

const SALES_CHANNEL = 'sales-updates';
const CACHE_KEY = 'sales';

export const createSale = async (data: CreateSalesInput): Promise<Sales> => {
  const totalAmount = data.quantity * data.price;
  const sale = await prisma.sales.create({
    data: {
      ...data,
      totalAmount
    }
  });

  safeDel(CACHE_KEY); // Invalidate cache

  await publish(SALES_CHANNEL, { type: 'CREATE', data: sale });
  return sale;
};

export const getSales = async (): Promise<Sales[]> => {
  const cachedSales = await safeGet(CACHE_KEY);
  if (cachedSales) {
    console.log("Cache hit");
    return JSON.parse(cachedSales);
  }

  const sales = await prisma.sales.findMany({
    orderBy: { createdAt: 'desc' }
  });

  if (sales) {
    await safeSet(CACHE_KEY, JSON.stringify(sales), 3600); // Cache for 1 hour
  }

  return sales;
};

export const getSaleById = async (id: number): Promise<Sales | null> => {
  return prisma.sales.findUnique({
    where: { id }
  });
};

export const updateSale = async (data: UpdateSalesInput): Promise<Sales> => {
  const { id, ...updateData } = data;
  const sale = await prisma.sales.update({
    where: { id },
    data: {
      ...updateData,
      totalAmount: updateData.quantity && updateData.price
        ? updateData.quantity * updateData.price
        : undefined
    }
  });

  safeDel(CACHE_KEY); // Invalidate cache

  await publish(SALES_CHANNEL, { type: 'UPDATE', data: sale });
  return sale;
};

export const deleteSale = async (id: number): Promise<Sales> => {
  const sale = await prisma.sales.delete({
    where: { id }
  });

  safeDel(CACHE_KEY); // Invalidate cache
  await publish(SALES_CHANNEL, { type: 'DELETE', data: { id } });
  return sale;
}; 