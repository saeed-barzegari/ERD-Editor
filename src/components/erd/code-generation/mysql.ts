import {Erd} from "@/components/erd/erd";

export function diagramToMySQLCode(erd: Erd) {
    const tables: string[] = [];
    for (const table of erd.tables) {
        const columns: string[] = [];
        const constraint: string[] = [];

        for (const primaryKeyColumn of table.primaryKeyColumns) {
            let column = `\t${primaryKeyColumn.name} ${primaryKeyColumn.type}`
            if(!primaryKeyColumn.nullable)
                column += ' NOT NULL'
            if(primaryKeyColumn.unique)
                column += ' UNIQUE'
            if(primaryKeyColumn.default.trim().length != 0)
                column += ` DEFAULT ${primaryKeyColumn.default}`
            columns.push(column)
            constraint.push(`\tPRIMARY KEY (${primaryKeyColumn.name})`)
        }

        for (const nonPrimaryKeyColumn of table.columns) {
            let column = `\t${nonPrimaryKeyColumn.name} ${nonPrimaryKeyColumn.type}`
            if(!nonPrimaryKeyColumn.nullable)
                column += ' NOT NULL'
            if(nonPrimaryKeyColumn.unique)
                column += ' UNIQUE'
            if(nonPrimaryKeyColumn.default.trim().length != 0)
                column += ` DEFAULT ${nonPrimaryKeyColumn.default}`
            columns.push(column)
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