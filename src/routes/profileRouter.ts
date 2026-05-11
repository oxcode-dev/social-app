import express from 'express';
import { 
    getUserDetails, changePassword, updateUserProfile, deleteProfile
} from '../controllers/profileController.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { changePasswordSchema, userDetailsSchema } from '../validations/profileSchema.ts';

const router = express.Router();

router.route('/')
    .get(auth, getUserDetails as any)
    .put(auth, validateInputData(userDetailsSchema), updateUserProfile as any);
    
router.post('/change-password', auth, validateInputData(changePasswordSchema), changePassword as any);
router.delete('/delete-account', auth, deleteProfile as any);

export { router as profileRouter };