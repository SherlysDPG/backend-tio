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

const excelMasterAnalyzer = async (aiResponse: any) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('public/data/ProductMaster.xlsx');

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error('No hay hojas en el Excel');
  }

  let colCOD: any = null;
  let colDESC: any = null;
  let colCOD_ARTICULO: any = null; // ✅ Nueva columna

  let results: any = [];

  // 🔍 Detectar columnas por header
  const headerRow = worksheet.getRow(1);

  headerRow.eachCell((cell, colNumber) => {
    const value = cell.value?.toString().trim();

    if (value === 'COD_BARRA') colCOD = colNumber;
    if (value === 'DESCRIPCION_1') colDESC = colNumber;
    if (value === 'COD_ARTICULO') colCOD_ARTICULO = colNumber; // ✅ Detectar nueva columna
  });

  if (!colCOD || !colDESC || !colCOD_ARTICULO) {
    // ✅ Validar nueva columna
    throw new Error('No se encontraron las columnas');
  }

  // 🟢 Recorrer TODAS las filas con datos
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // saltar header

    const COD_BARRA = row.getCell(colCOD).value;
    const DESCRIPCION_1 = row.getCell(colDESC).value;
    const COD_ARTICULO = row.getCell(colCOD_ARTICULO).value; // ✅ Leer nueva columna

    results.push({
      'Código de Barras': COD_BARRA ?? null,
      'Código del articulo Master': COD_ARTICULO ?? null, // ✅ Añadir al resultado
      'Descripción Master': DESCRIPCION_1 ?? null,
    });
  });

  const cleanResults = cleanResult(results, aiResponse);

  return cleanResults;
};

const cleanResult = (master: any, pedidos: any) => {
  const masterMap: any = {};
  master.forEach((item: any) => {
    masterMap[item['Código de Barras']] = {
      descripcion: item['Descripción Master'],
      codigo: item['Código del articulo Master'], // ✅ Guardar en el map
    };
  });

  // Mapear los datos incluyendo la nueva columna en su posición correcta
  const dataConMaster = pedidos.data.map((item: any) => ({
    'Código de Barras': item.col1,
    'Código del articulo Master': masterMap[item.col1]?.codigo || '', // ✅ Entre Barras y Descripción
    'Descripción Master': masterMap[item.col1]?.descripcion || '',
    'Descripción Pedido': item.col2,
    Unidades: item.col3,
    Precio: item.col4,
    Total: item.col5,
  }));

  const pedidosActualizado = {
    headers: [
      'Código de Barras',
      'Código del articulo Master', // ✅ En su posición correcta
      'Descripción Master',
      'Descripción Pedido',
      'Unidades',
      'Precio',
      'Total',
    ],
    data: dataConMaster,
  };

  return pedidosActualizado;
};

export { createExcel, excelMasterAnalyzer };
