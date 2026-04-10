import { Request, Response } from 'express';
import { aiPdfAnalyzer } from '../services/ai';
import { createExcel, excelMasterAnalyzer } from '../services/excel';

const analyzePDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const aiResponse = await aiPdfAnalyzer(req.file?.filename);
    const aiAnalyzedResponse = await excelMasterAnalyzer(aiResponse);
    const excel = await createExcel(req.file?.filename, aiAnalyzedResponse);

    res.json({ URL: excel });
  } catch (e: any) {
    console.log(e);

    if (e.status === 503)
      return res.status(503).json({
        message:
          'Este modelo está experimentando una alta demanda. Los picos de demanda suelen ser temporales. Inténtelo de nuevo más tarde.',
      });

    if (e.status === 429)
      return res
        .status(429)
        .json({ message: 'Ha excedido la cuota de usos diarios' });

    res.status(500).json({ message: 'Error del servidor' });
  }
};

export { analyzePDF };
