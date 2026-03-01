import ExcelJS from 'exceljs';

const createExcel = async (fileName: string, data: any) => {
  try {
    const info = data;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hoja1');

    // 🔥 Crear columnas dinámicamente
    sheet.columns = info.headers.map((header: string) => ({
      header: header,
      key: header,
      width: 20,
    }));

    // 🔥 Insertar filas
    info.data.forEach((row: any) => {
      sheet.addRow(row);
    });

    await workbook.xlsx.writeFile(`public/${fileName}.xlsx`);

    return `${fileName}.xlsx`;
  } catch (error) {
    console.log(error);
  }
};

export { createExcel };
