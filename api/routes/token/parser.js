export const parseFileData = (fileData) => {
    console.log(fileData)
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split('|').map(col => col.trim());
        

            return {
                CODIGO_GRUPO: String(columns[0]).trim(),
                CODIGO_SIMBOLO: String(columns[1]).trim(),
                DES_SIMBOLO: String(columns[2]).trim(),
                VALOR_COMPRA: String(columns[3]).trim(),
                VALOR_VENTA: String(columns[4]).trim(),
                COMISION: String(columns[6]).trim(),
                FECHA: String(columns[5]).trim()
            };
        
    });
};
