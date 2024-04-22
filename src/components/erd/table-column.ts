import {JustifyContent, Row} from "@/components/erd/basic/row";
import {Text} from "@/components/erd/basic/text";
import {State} from "@/components/erd/basic/state";

export class TableColumn extends Row {
    private _name = "";
    private _primaryKey = false;
    private _foreignKey = false;

    constructor(name: string) {
        super();
        this.name = name;
        const textName = new Text(name).setMargin(2, 32, 2, 2).setTextColor("white");
        const textPrimaryKey = new Text("PK").setMargin(2, 2, 2, 2).setTextColor("white").setHidden(!this._primaryKey);
        const textForeignKey = new Text("FK").setMargin(2, 16, 2, 2).setTextColor("#4e8bf6").setHidden(!this._foreignKey);
        const iconOption = new Text("#").setPadding(2, 2, 2, 2);
        this.addChild(textName)
        this.addChild(new Row([
            textPrimaryKey, textForeignKey, iconOption
        ]))

        this.setJustifyContent(JustifyContent.SpaceBetween)

        this.addListener('changeName', value => textName.setText(value))
        this.addListener('changePrimaryKey', value => textPrimaryKey.setHidden(!value))
        this.addListener('changeForeignKey', value => textForeignKey.setHidden(!value))
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
        return this._foreignKey;
    }

    set foreignKey(foreignKey: boolean) {
        this._foreignKey = foreignKey;
        this.emit("changeForeignKey", foreignKey)
    }

    setPrimaryKey(primaryKey: boolean) {
        this.primaryKey = primaryKey;
        return this;
    }
}