import {v4 as uuid} from "uuid"
import {JustifyContent, Row} from "@/components/erd/basic/row";
import {Text} from "@/components/erd/basic/text";
import {State} from "@/components/erd/basic/state";

export class TableColumn extends Row {
    private _id: string;
    private _name = "";
    private _primaryKey = false;
    private _foreignKey:TableColumn | null = null;
    private _type = ""
    private _default = "";
    private _nullable = false;
    private _unique = false;

    constructor(name: string) {
        super();
        this._id = uuid();
        this.name = name;
        const textName = new Text(name).setMargin(2, 32, 2, 2).setTextColor("white");
        const textPrimaryKey = new Text("PK").setMargin(2, 2, 2, 2).setTextColor("white").setHidden(!this._primaryKey);
        const textForeignKey = new Text("FK").setMargin(2, 16, 2, 2).setTextColor("#4e8bf6").setHidden(!this.foreignKey);
        const iconOption = new Text("#").setPadding(2, 2, 2, 2);
        this.addChild(textName)
        this.addChild(new Row([
            textPrimaryKey, textForeignKey, iconOption
        ]))
        this.setPadding(0, 5, 0, 5)

        this.setJustifyContent(JustifyContent.SpaceBetween)

        this.addListener('changeName', value => textName.setText(value))
        this.addListener('changePrimaryKey', value => textPrimaryKey.setHidden(!value))
        this.addListener('changeForeignKey', () => textForeignKey.setHidden(!this.foreignKey))
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
        this.emit("changeName", name)
    }

    get primaryKey(): boolean {
        return this._primaryKey;
    }

    set primaryKey(primaryKey: boolean) {
        this._primaryKey = primaryKey;
        this.emit("changePrimaryKey", primaryKey)
    }

    get foreignKey(): boolean {
        return this._foreignKey != null;
    }

    set foreignKey(foreignKey: TableColumn | null) {
        this._foreignKey = foreignKey;
        console.log("chang fk")
        this.emit("changeForeignKey", foreignKey != null)
    }

    get referenceForeignKeyColumn(): TableColumn | null {
        return this._foreignKey;
    }

    setPrimaryKey(primaryKey: boolean) {
        this.primaryKey = primaryKey;
        return this;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get nullable(): boolean {
        return this._nullable;
    }

    set nullable(value: boolean) {
        this._nullable = value;
    }

    get id() {
        return this._id;
    }

    get unique(): boolean {
        return this._unique;
    }

    set unique(value: boolean) {
        this._unique = value;
    }

    get default(): string {
        return this._default;
    }

    set default(value: string) {
        this._default = value;
    }

    exportDatabaseModel() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            primaryKey: this.primaryKey,
            nullable: this.nullable,
            unique: this.unique,
            default: this.default
        } as ColumnDatabaseModel;
    }

    importDatabaseModel(columnDatabaseModel: ColumnDatabaseModel) {
        this._id = columnDatabaseModel.id;
        this.name = columnDatabaseModel.name;
        this.type = columnDatabaseModel.type;
        this.primaryKey = columnDatabaseModel.primaryKey;
        this.nullable = columnDatabaseModel.nullable;
        this.unique = columnDatabaseModel.unique;
        this.default = columnDatabaseModel.default
    }
}