export const parseVerifierFileData = (fileData) => {
    console.log(fileData)
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split('|').map(col => col.trim());
        

            return {
                NRO_DOCUMENTO: columns[0],
                APELLIDO: columns[1],
                NOMBRE: columns[2],
                SEG_NOMBRE: columns[3],
                ESTADO: columns[4],
            };
        
    });
};