import {State} from "@/components/erd/basic/state";

export interface Selectable{
    isSelected:State<boolean>;
    setSelected(isSelected: boolean):void;
}

export function isSelectable(obj:object): obj is Selectable{
    return 'isSelected' in obj;
}