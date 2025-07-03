export const parseFileData = (fileData) => {
    console.log(fileData)
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split('|').map(col => col.trim());
        

            return {
                SIMBOLO: columns[0].trim(),
                NOMBRE: columns[1].trim(),
                VALOR_COMPRA: columns[2].trim(),
                VALOR_VENTA: columns[3].trim(),
                STOCK: columns[4].trim(),
                VENCIMIENTO: columns[5].trim(),
            };
        
    });
};
