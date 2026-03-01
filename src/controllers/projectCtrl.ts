import { Request, Response } from 'express';
import { createExcel } from '../services/excel';
import { testAI } from '../services/ai';

const analyzePDF = async (req: Request, res: Response) => {
  try {
    console.log('aquí estoy');
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const aiResponse = await testAI(req.file?.filename);
    const excel = await createExcel(req.file?.filename, aiResponse);

    console.log(excel);
    res.json({ URL: excel });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

export { analyzePDF };
