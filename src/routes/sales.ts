import { Router } from 'express';
import { z } from 'zod';
import * as salesService from '../services/sales';

const salesRouter = Router();

const createSalesSchema = z.object({
  productName: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive()
});

const updateSalesSchema = createSalesSchema.partial().extend({
  id: z.number()
});

/**
 * @typedef {object} CreateSaleRequest
 * @property {string} productName.required - Name of the product
 * @property {number} quantity.required - Quantity of the product
 * @property {number} price.required - Price of the product
 */

/**
 * @typedef {object} SaleResponse
 * @property {number} id - The sale ID
 * @property {string} productName - Name of the product
 * @property {number} quantity - Quantity of the product
 * @property {number} price - Price of the product
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * POST /api/sales
 * @summary Create a new sale
 * @tags Sales
 * @param {CreateSaleRequest} request.body.required - Sale information
 * @return {SaleResponse} 200 - Success response
 * @return {object} 400 - Validation error
 * @return {object} 500 - Server error
 */

salesRouter.post('/', async (req, res) => {
  try {
    const data = createSalesSchema.parse(req.body);
    const sale = await salesService.createSale(data);
    res.json(sale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * GET /api/sales
 * @summary Get all sales
 * @tags Sales
 * @return {array<SaleResponse>} 200 - List of sales
 * @return {object} 500 - Server error
 */

salesRouter.get('/', async (_req, res) => {
  try {
    const sales = await salesService.getSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/sales/{id}
 * @summary Get a sale by ID
 * @tags Sales
 * @param {number} id.path.required - Sale ID
 * @return {SaleResponse} 200 - Sale information
 * @return {object} 404 - Sale not found
 * @return {object} 500 - Server error
 */

salesRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sale = await salesService.getSaleById(id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/sales/{id}
 * @summary Update a sale
 * @tags Sales
 * @param {number} id.path.required - Sale ID
 * @param {CreateSaleRequest} request.body.required - Updated sale information
 * @return {SaleResponse} 200 - Updated sale information
 * @return {object} 400 - Validation error
 * @return {object} 500 - Server error
 */

salesRouter.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = updateSalesSchema.parse({ ...req.body, id });
    const sale = await salesService.updateSale(data);
    res.json(sale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * DELETE /api/sales/{id}
 * @summary Delete a sale
 * @tags Sales
 * @param {number} id.path.required - Sale ID
 * @return {SaleResponse} 200 - Deleted sale information
 * @return {object} 500 - Server error
 */

salesRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sale = await salesService.deleteSale(id);
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default salesRouter; 