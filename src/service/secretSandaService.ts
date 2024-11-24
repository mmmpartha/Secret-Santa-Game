export function assignSecretSanta(employees: any[], lastYearAssignments: any[]): any[] {
    const assignments: any[] = [];
    const availableChildren = [...employees];

    employees.forEach((employee) => {
        const invalidChoices = lastYearAssignments
            .filter((prev) => prev.Employee_Name === employee.Employee_Name)
            .map((prev) => prev.Secret_Child_Name);

        const eligibleChildren = availableChildren.filter(
            (child) => child.Employee_Name !== employee.Employee_Name && !invalidChoices.includes(child.Employee_Name)
        );

        if (eligibleChildren.length === 0) throw new Error('No valid assignments possible.');

        const chosenChild = eligibleChildren[Math.floor(Math.random() * eligibleChildren.length)];
        assignments.push({
            Employee_Name: employee.Employee_Name,
            Employee_EmailID: employee.Employee_EmailID,
            Secret_Child_Name: chosenChild.Employee_Name,
            Secret_Child_EmailID: chosenChild.Employee_EmailID,
        });

        const index = availableChildren.indexOf(chosenChild);
        availableChildren.splice(index, 1);
    });

    return assignments;
}
