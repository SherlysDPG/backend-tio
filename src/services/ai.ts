import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

const aiPdfAnalyzer = async (pdfPath: string) => {
  const fullPath = `public/uploads/${pdfPath}`;

  const pdfBuffer = fs.readFileSync(fullPath);
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
            text: `
            Extrae todas las tablas de este PDF. Para cada tabla:

            1. Filtra solo las tablas que contengan información de pedidos y sus columnas.
            2. Une todas estas tablas en una sola tabla consolidada.
            3. Convierte la tabla unificada a formato JSON.
            4. El JSON debe ser un objeto con la siguiente estructura, NO un array de objetos:
            {
              "headers": ["Código de Barras", "Descripción Pedido", "Unidades", "Precio", "Total"],
              "data": [
                {"col1": "dato1", "col2": "dato2", "col3": "dato3", "col4": "dato4", "col5": "dato5"},
                ...
              ]
            }

            Responde SOLO con un JSON válido siguiendo esta estructura, sin texto adicional, explicaciones ni comentarios.`,
          },
        ],
      },
    ],
  });

  const raw = response.text ?? '';

  // Limpieza robusta: elimina cualquier variación de fence de markdown
  const cleaned = raw
    .replace(/^```[\w]*\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  // Parsear ANTES de borrar el archivo
  const parsed = JSON.parse(cleaned); // lanza si el JSON es inválido

  fs.unlinkSync(fullPath);

  return parsed;
};

export { aiPdfAnalyzer };
