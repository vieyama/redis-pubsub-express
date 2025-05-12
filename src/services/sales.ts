import prisma from '../utils/prisma';
import { CreateSalesInput, UpdateSalesInput, Sales } from '../types/sales';
import { publish } from '../services/redis';

const SALES_CHANNEL = 'sales-updates';

export const createSale = async (data: CreateSalesInput): Promise<Sales> => {
  const totalAmount = data.quantity * data.price;
  const sale = await prisma.sales.create({
    data: {
      ...data,
      totalAmount
    }
  });
  
  await publish(SALES_CHANNEL, { type: 'CREATE', data: sale });
  return sale;
};

export const getSales = async (): Promise<Sales[]> => {
  return prisma.sales.findMany({
    orderBy: { createdAt: 'desc' }
  });
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
  
  await publish(SALES_CHANNEL, { type: 'UPDATE', data: sale });
  return sale;
};

export const deleteSale = async (id: number): Promise<Sales> => {
  const sale = await prisma.sales.delete({
    where: { id }
  });
  
  await publish(SALES_CHANNEL, { type: 'DELETE', data: { id } });
  return sale;
}; 