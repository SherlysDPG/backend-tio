import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

const testAI = async (pdfPath: string) => {
  const pdfBuffer = fs.readFileSync(`public/uploads/${pdfPath}`);
  const base64PDF = pdfBuffer.toString('base64');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64PDF,
            },
          },
          {
            text: `Extrae todas las tablas de este PDF.
                   Para cada tabla:
                   1. Extrae solo las tablas de los pedidos y sus columnas
                   2. une todas las tablas en una sola
                   3. Conviértela a formato JSON
                   4. que responda con un objeto no un array de objetos JSON
                   {"headers" : ["col1", "col2", ...], "data" : [{"col1": "dato1", "col2": "dato2", ...}]}
                   Responde SOLO con un array JSON válido, sin texto adicional.`,
          },
        ],
      },
    ],
  });

  const raw = response.text ?? '';

  // Limpiar markdown si viene con ```json ... ```
  const cleaned = raw
    .replace(/^```json\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  try {
    fs.unlinkSync(`public/uploads/${pdfPath}`);
    return JSON.parse(cleaned);
  } catch {
    console.warn('No se pudo parsear como JSON, retornando texto crudo');
    return raw;
  }
};

export { testAI };
