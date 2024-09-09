import {Path} from "@/components/erd/basic/path";
import {Table} from "@/components/erd/table";
import {Point} from "@/components/erd/basic/point";
import {TableColumn} from "@/components/erd/table-column";
import {v4 as uuid} from "uuid";

enum PointDirection {
    Top,
    Left,
    Right,
    Bottom
}

export enum ReferenceNotation {
    IDEF1X,
    CrowsFoot
}

export class Reference extends Path {
    private _id: string;
    fromTable: Table;
    toTable: Table;
    foreignKeyColumns:TableColumn[] = [];
    _identifying = false;
    static notation: ReferenceNotation = ReferenceNotation.IDEF1X;

    constructor(fromTable: Table, toTable: Table, isImportingProject = false, id = uuid()) {
        super();
        this.fromTable = fromTable;
        this.toTable = toTable;
        this._id = id;

        this.addPoint(0, 0);
        this.addPoint(0, 0)
        this.addPoint(0, 0);
        this.addPoint(0, 0);
        this.addPoint(0, 0);

        const lineDash = [5, 5];
        this.lineDash = lineDash;
        this.addListener("changeIdentifying", value => this.lineDash = value? [] : lineDash)

        if(isImportingProject) return;
        for(const column of this.toTable.primaryKeyColumns){
            this.registerColumnToForeignKey(column)
        }
        this.toTable.addListener("add-column", (column:TableColumn)=>{
            if (!column.primaryKey || column.foreignKey) return;
            this.registerColumnToForeignKey(column)
        })
    }

    private registerColumnToForeignKey(referenceColumn:TableColumn, foreignKeyColumn?:TableColumn){
        const fkColumn = foreignKeyColumn ? foreignKeyColumn : new TableColumn(this.toTable.name + "_" + referenceColumn.name);
        this.foreignKeyColumns.push(fkColumn);
        fkColumn.foreignKey = referenceColumn;
        if(!foreignKeyColumn)
            this.fromTable.addColumnWithColumn(fkColumn);
        referenceColumn.addListener("changePrimaryKey", () => {
            this.fromTable.removeColumn(fkColumn);
            this.foreignKeyColumns.remove(this.foreignKeyColumns.indexOf(fkColumn));
        })
        fkColumn.addListener("changePrimaryKey",(value)=>{
            if(!value && !this._identifying || value && this._identifying) return;
            let identifying = true;
            this.foreignKeyColumns.forEach(column => {
                if(!column.primaryKey)
                    identifying = false;
            })
            this._identifying = identifying;
            this.emit("changeIdentifying", identifying);
        })
    }

    getPointDirection(base: Table, destX: number, destY: number) {
        const yTopRight = ((base.getCenterY() - base.getTopY()) / (base.getCenterX() - base.getRightX())) * (destX - base.getRightX()) + base.getTopY();
        const yTopLeft = ((base.getCenterY() - base.getTopY()) / (base.getCenterX() - base.getLeftX())) * (destX - base.getLeftX()) + base.getTopY();
        if (destY > yTopRight) {
            if (destY > yTopLeft) {
                return PointDirection.Bottom;
            } else {
                return PointDirection.Right;
            }
        } else {
            if (destY > yTopLeft) {
                return PointDirection.Left;
            } else {
                return PointDirection.Top;
            }
        }
    }

    getPointPositionX(table: Table, pointDirection: PointDirection) {
        switch (pointDirection) {
            case PointDirection.Bottom:
            case PointDirection.Top:
                return table.getCenterX();
            case PointDirection.Right:
                return table.getRightX();
            case PointDirection.Left:
                return table.getLeftX();
        }
    }

    getComplementDirection(pointDirection: PointDirection) {
        switch (pointDirection) {
            case PointDirection.Bottom:
                return PointDirection.Top;
            case PointDirection.Right:
                return PointDirection.Left;
            case PointDirection.Left:
                return PointDirection.Right;
            case PointDirection.Top:
                return PointDirection.Bottom;
        }
    }

    getPointPositionY(table: Table, pointDirection: PointDirection) {
        switch (pointDirection) {
            case PointDirection.Left:
            case PointDirection.Right:
                return table.getCenterY();
            case PointDirection.Top:
                return table.getTopY();
            case PointDirection.Bottom:
                return table.getBottomY();
        }
    }

    draw(context: CanvasRenderingContext2D) {
        const startDirection =
            this.fromTable == this.toTable ?
                PointDirection.Top :
                this.getPointDirection(this.fromTable, this.toTable.getCenterX(), this.toTable.getCenterY());
        const startX = this.getPointPositionX(this.fromTable, startDirection);
        const startY = this.getPointPositionY(this.fromTable, startDirection);
        const endDirection =
            this.fromTable == this.toTable ?
                PointDirection.Right :
                this.getPointDirection(this.toTable, startX, startY);
        const endX = this.getPointPositionX(this.toTable, endDirection);
        const endY = this.getPointPositionY(this.toTable, endDirection);

        this.change(0, startX, startY);
        if(this.fromTable == this.toTable){
            this.change(1, startX, startY - 50);
            this.change(2, endX + 50, startY - 50);
            this.change(3, endX + 50, endY);
        }else {
            if (this.directionIsVertical(startDirection) && this.directionIsHorizontal(endDirection)) {
                this.change(1, startX, endY);
                this.change(2, startX, endY);
            } else if (this.directionIsHorizontal(startDirection) && this.directionIsVertical(endDirection)) {
                this.change(1, endX, startY);
                this.change(2, endX, startY);
            } else if (this.directionIsHorizontal(startDirection) && this.directionIsHorizontal(endDirection)) {
                const middleX = (startX + endX) / 2
                this.change(1, middleX, startY);
                this.change(2, middleX, endY);
            } else {
                const middleY = (startY + endY) / 2
                this.change(1, startX, middleY);
                this.change(2, endX, middleY);
            }
            this.change(3, endX, endY);
        }
        this.change(4, endX, endY);
        super.draw(context);

        context.save()
        if (Reference.notation == ReferenceNotation.IDEF1X) {
            const circlePosition = this.shiftPositionWithDirection(new Point(startX - 4, startY - 4), startDirection, 4)

            context.beginPath();
            context.roundRect(circlePosition.x, circlePosition.y, 8, 8, 20)
            context.fillStyle = "#9498a6"
            context.fill()
        } else if (Reference.notation == ReferenceNotation.CrowsFoot) {
            true // todo: implement
        }
        context.restore()
    }

    shiftPositionWithDirection(position:Point, direction:PointDirection, shiftedValue:number){
        switch (direction) {
            case PointDirection.Bottom:
                position.y += shiftedValue;
                break;
            case PointDirection.Top:
                position.y -= shiftedValue;
                break;
            case PointDirection.Left:
                position.x -= shiftedValue;
                break;
            case PointDirection.Right:
                position.x += shiftedValue;
                break
        }
        return position;
    }

    directionIsHorizontal(direction: PointDirection) {
        return direction == PointDirection.Left || direction == PointDirection.Right;
    }

    directionIsVertical(direction: PointDirection) {
        return direction == PointDirection.Bottom || direction == PointDirection.Top;
    }

    get identifying(){
        return this._identifying;
    }

    set identifying(value){
        this.foreignKeyColumns.forEach(column => {
            column.primaryKey = value;
        })
        this._identifying = value;
    }

    get id(): string {
        return this._id;
    }

    exportDatabaseModel() {
        const foreignKeysDatabaseModel:ForeignKeyDatabaseModel[] = [];
        for (const foreignKeyColumn of this.foreignKeyColumns) {
            foreignKeysDatabaseModel.push({
                pkColumnId: foreignKeyColumn.referenceForeignKeyColumn?.id,
                fkColumnId: foreignKeyColumn.id
            } as ForeignKeyDatabaseModel)
        }
        return {
            id: this._id,
            fkColumns: foreignKeysDatabaseModel,
            toTableId: this.toTable.id,
            fromTableId: this.fromTable.id,
        } as ReferenceDatabaseModel
    }

    importDatabaseModel(referenceDatabaseModel: ReferenceDatabaseModel) {
        this._id = referenceDatabaseModel.id
        for (const fkColumnDatabaseModel of referenceDatabaseModel.fkColumns) {
            const pkColumn = this.toTable.getColumnById(fkColumnDatabaseModel.pkColumnId);
            const fkColumn = this.fromTable.getColumnById(fkColumnDatabaseModel.fkColumnId);
            if (!pkColumn || !fkColumn)
                continue;
            fkColumn.foreignKey = pkColumn;
            this.registerColumnToForeignKey(pkColumn, fkColumn)
            this.foreignKeyColumns.push(fkColumn);
        }
    }

    remove() {
        this.foreignKeyColumns.forEach(column => {
            this.fromTable.removeColumn(column);
        })
    }
}