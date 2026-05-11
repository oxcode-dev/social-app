import express from 'express';
import type { PaginationType } from '../types/index.ts';

const handlePagination = async (req: express.Request & PaginationType, res: express.Response, next: express.NextFunction)  => {
    let { page = 1, perPage = 1 } = req.query as {page?: string | number, perPage?: string | number};
    
    if (Number(page) < 1) page = 1

    const skip = (Number(page) - 1) * Number(perPage);

    req.limit = Number(perPage);
    req.skip = skip;
    req.page = Number(page);
    
    next();
}

export { handlePagination };