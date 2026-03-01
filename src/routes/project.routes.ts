import { Router } from 'express';
import { upload } from '../services/multer';

const router = Router();

import { analyzePDF } from '../controllers/projectCtrl';

router.post('/', upload.single('myFile'), analyzePDF);

export { router };
