export const parseFileData = (fileData) => {
    console.log(fileData)
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split('|').map(col => col.trim());
        

            return {
                SIMBOLO: columns[0],
                NOMBRE: columns[1],
                VALOR_COMPRA: columns[2],
                VALOR_VENTA: columns[3],
                STOCK: columns[4],
                VENCIMIENTO: columns[5],
            };
        
    });
};
