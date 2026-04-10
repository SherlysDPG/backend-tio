import { Router } from 'express';
import { cleanUpFiles } from '../middlewares/cleanUpFiles';
import { upload } from '../services/multer';

const router = Router();

import { analyzePDF } from '../controllers/projectCtrl';

router.post('/', cleanUpFiles, upload.single('myFile'), analyzePDF);

export { router };
