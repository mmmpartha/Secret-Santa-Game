import fs from 'fs';
import csvParser from 'csv-parser';
import { parse } from 'json2csv';

/**
 * Parse a CSV file from a file path or raw string
 */
export function parseCSV(data: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const rows: any[] = [];
        const stream = fs.createReadStream(data).pipe(csvParser());
        stream
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', (error) => reject(error));
    });
}

/**
 * Write a CSV file and return the file path or raw content
 */
export function writeCSV(data: any[]): string {
    const fields = ['Employee_Name', 'Employee_EmailID', 'Secret_Child_Name', 'Secret_Child_EmailID'];
    const opts = { fields };
    return parse(data, opts);
}
