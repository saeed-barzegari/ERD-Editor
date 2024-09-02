import {Erd} from "@/components/erd/erd";

export function diagramToMySQLCode(erd: Erd) {
    const tables: string[] = [];
    for (const table of erd.tables) {
        const columns: string[] = [];
        const constraint: string[] = [];

        for (const primaryKeyColumn of table.primaryKeyColumns) {
            columns.push(`\t${primaryKeyColumn.name} ${primaryKeyColumn.type}`)
            constraint.push(`\tPRIMARY KEY (${primaryKeyColumn.name})`)
        }

        for (const column of table.columns) {
            columns.push(`\t${column.name} ${column.type}`)
        }

        for (const reference of erd.getReferencesByFromTable(table)) {
            const pkColumns: string[] = [];
            const fkColumns: string[] = [];
            for (const fkColumn of reference.foreignKeyColumns) {
                if (fkColumn.referenceForeignKeyColumn)
                    pkColumns.push(fkColumn.referenceForeignKeyColumn.name);
                fkColumns.push(fkColumn.name)
            }
            constraint.push(`\tFOREIGN KEY (${pkColumns.join(', ')}) REFERENCES ${reference.toTable.name}(${fkColumns.join(', ')})`)
        }
        const columnsQuery = columns.join(',\n');
        const constraintQuery = constraint.join(',\n');
        const createTableBody = `${columnsQuery}${constraint.length != 0 ? ',\n' : ''}${constraintQuery}`
        tables.push(`CREATE TABLE ${table.name} (\n${createTableBody}\n)`)
    }
    return tables.join('\n')
}