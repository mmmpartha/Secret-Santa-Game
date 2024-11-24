import { Router, Request, Response } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';

const newroute = Router();
const upload = multer({ dest: 'uploads/' }); 

const parseCSVFile = async (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

const generateAssignments = (employees: any[], lastYearAssignments: any[]) => {
    const assignments: any[] = [];
    const assigned = new Set();
    const shuffledEmployees = employees.slice().sort(() => Math.random() - 0.5);

    employees.forEach((employee) => {
        const { Employee_EmailID } = employee;

        const possibleChildren = shuffledEmployees.filter(
            (child) =>
                child.Employee_EmailID !== Employee_EmailID &&
                !assigned.has(child.Employee_EmailID) &&
                !lastYearAssignments.some(
                    (last) =>
                        last.Employee_EmailID === Employee_EmailID &&
                        last.Secret_Child_EmailID === child.Employee_EmailID
                )
        );

        if (possibleChildren.length === 0) {
            throw new Error(`Cannot assign Secret Child for ${Employee_EmailID}.`);
        }

        const secretChild = possibleChildren[Math.floor(Math.random() * possibleChildren.length)];
        assignments.push({
            Employee_EmailID,
            Secret_Child_EmailID: secretChild.Employee_EmailID,
        });

        assigned.add(secretChild.Employee_EmailID);
    });

    return assignments;
};

newroute.post(
    '/upload',
    upload.fields([
        { name: 'employeesCSV', maxCount: 1 },
        { name: 'lastYearCSV', maxCount: 1 },
    ]),
    async (req: Request, res: Response) => {
        try {
            if (!req.files || !('employeesCSV' in req.files) || !('lastYearCSV' in req.files)) {
                return res.status(400).json({ message: 'Both employeesCSV and lastYearCSV are required.' });
            }

            const employeesFile = (req.files as any).employeesCSV[0].path;
            const lastYearFile = (req.files as any).lastYearCSV[0].path;

            const employeesData = await parseCSVFile(employeesFile);
            const lastYearData = await parseCSVFile(lastYearFile);

            fs.unlinkSync(employeesFile);
            fs.unlinkSync(lastYearFile);

            const assignments = generateAssignments(employeesData, lastYearData);

            return res.status(201).json({
                message: 'Secret Santa assignments generated successfully!',
                data: assignments,
            });
        } catch (error: any) {
            console.error('Error:', error.message);
            return res.status(500).json({
                message: 'An error occurred while processing the files.',
                error: error.message,
            });
        }
    }
);

export default newroute;
