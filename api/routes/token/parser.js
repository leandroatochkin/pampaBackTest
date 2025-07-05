export const parseFileData = (fileData) => {
    console.log(fileData)
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split('|').map(col => col.trim());
        

            return {
                CODIGO_GRUPO: columns[0].trim(),
                CODIGO_SIMBOLO: columns[1].trim(),
                DES_SIMBOLO: columns[2].trim(),
                VALOR_COMPRA: columns[3].trim(),
                VALOR_VENTA: columns[4].trim(),
                FECHA: columns[5].trim(),
            };
        
    });
};
