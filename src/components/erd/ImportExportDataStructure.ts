interface ColumnDatabaseModel {
    id: string,
    name: string,
    type: string,
    primaryKey: boolean,
    nullable: boolean,
}

interface TableDatabaseModel {
    id: string,
    name: string,
    columns: ColumnDatabaseModel[],
    pkColumns: ColumnDatabaseModel[],
}

interface ForeignKeyDatabaseModel {
    pkColumnId: string,
    fkColumnId: string
}

interface ReferenceDatabaseModel {
    fkColumns: ForeignKeyDatabaseModel[],
    toTableId: string,
    fromTableId: string,
}

interface DatabaseModel {
    tables: TableDatabaseModel[],
    references: ReferenceDatabaseModel[],
}

interface TableDiagramModel {
    id: string,
    x: number,
    y: number,
}

interface DiagramModel {
    diagramTables: TableDiagramModel[],
}

interface Project {
    databaseModel: DatabaseModel,
    diagramModel: DiagramModel,

}

