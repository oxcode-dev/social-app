import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();



export { router as commentRouter };