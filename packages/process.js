const ExcelJS = require('exceljs');
const fs = require('fs');
const { fileURLToPath } = require('url');

const execute = async (path) => {

    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);

    const sheet = workbook.getWorksheet('Point Data Dump');
    const rows = sheet.getRows(3, sheet.rowCount).filter(row => row.values[1]);
    const ACTIVITY_INDEX = 9;

    rows.forEach((row, index) => { 
        const activityString = row.getCell(ACTIVITY_INDEX).value;
        if(!activityString)
            return;

        let activities = activityString.split(';');
        activities = activities.filter(act => act.length > 0);

        activities.forEach((activity, act_idx) => {
            if(act_idx == 0) {
                const row = sheet.getRow(index + 3);
                row.values[ACTIVITY_INDEX] = activity;
                row.getCell(ACTIVITY_INDEX).value = activity;
                row.commit();
                return;
            } 

            console.log('duplicating at: ', index + 3);
            sheet.duplicateRow(index + 3, 1, true)
            const row = sheet.getRow(index + 3);
            row.getCell(ACTIVITY_INDEX).value = activity;
            row.commit();

        });
    });

    sheet.getRows(3, sheet.rowCount).forEach((updateRow, index) => {
        const updatedFormula = `=SUM(M${index + 3}:P${index + 3})`
        updateRow.getCell('Q').value = { formula: updatedFormula };
        updateRow.commit();
    });

    await workbook.xlsx.write(fs.createWriteStream(path));
}


if(process.argv[1] === fileURLToPath(import.meta.url)) {
    if(process.argv.length != 3) {
        console.log('Usage: node process.js <PathToFile>')
    }

    const path = process.argv[2];
    execute(path);
}
export default execute;