<script lang="ts">

import {show, Erd, ContextMenuContent} from "@/components/erd/erd";
import {defineComponent, ref} from "vue";
import {Table} from "@/components/erd/table";
import {Canvas} from "@/components/erd/basic/canvas";
import {TableColumn} from "@/components/erd/table-column";
import {diagramToMySQLCode} from "@/components/erd/code-generation/mysql";
import ExportCode from "@/components/ExportCode.vue";

export default defineComponent({
  components: {ExportCode},
  computed: {
    ContextMenuContent() {
      return ContextMenuContent
    },
    TableColumn() {
      return TableColumn
    }
  },
  methods: {
    diagramToMySQLCode,
    showContextMenu(x: number, y: number) {
      this.contextMenuIsHidden = false;
      const menu = this.$refs.menu as HTMLElement;
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      const hideListener = () => {
        this.hideContextMenu();
        window.removeEventListener('click', hideListener);
      }
      window.addEventListener('click', hideListener)
      return false;
    },
    hideContextMenu() {
      this.contextMenuIsHidden = true;
    },
    showTableEditor(x: number, y: number) {
      this.tableEditorIsHidden = false;
      const tableEditor = this.$refs.tableEditor as HTMLElement;
      tableEditor.style.top = `${y}px`;
      tableEditor.style.left = `${x}px`;

      const hideListener = (ev: MouseEvent) => {
        if (!tableEditor.contains(ev.target as HTMLElement)) {
          this.hideTableEditor();
          window.removeEventListener('mousedown', hideListener)
        }
      }
      setTimeout(() => {
        window.addEventListener('mousedown', hideListener)
      }, 50)
    },
    hideTableEditor() {
      this.tableEditorIsHidden = true;
    },
    addTable() {
      const canvasElement = this.$refs.canvasElement as HTMLCanvasElement;
      const menu = this.$refs.menu as HTMLElement;
      const rectCanvas = canvasElement.getBoundingClientRect();
      const rectMenu = menu.getBoundingClientRect();
      const xRightClick = rectMenu.left - rectCanvas.left;
      const yRightClick = rectMenu.top - rectCanvas.top;
      this.erd.addTableWithGlobalPos(xRightClick, yRightClick);
      this.showTableEditor(xRightClick, yRightClick);
    },
    removeTable() {
      this.erd.removeTable(this.table as Table);
    },
    changeTableName(ev: FocusEvent) {
      if (!ev.target) return;
      const target = ev.target as HTMLInputElement
      this.table.name = target.value; // TODO: check for duplicate table name
      target.value = "";
    },
    startColumnDrag(ev: DragEvent, list: number, columnIndex: number) {
      ev.dataTransfer?.setData("columnIndex", columnIndex.toString());
      ev.dataTransfer?.setData("columnList", list.toString());
      ev.dataTransfer?.setData("columnHeight", (ev.target as HTMLElement).parentElement?.offsetHeight.toString() as string);
    },
    onDropColumn(ev: DragEvent, list: number) {
      ev.preventDefault();
      const columnIndex = parseInt(ev.dataTransfer?.getData("columnIndex") as string);
      const columnList = parseInt(ev.dataTransfer?.getData("columnList") as string);
      const columnHeight = parseInt(ev.dataTransfer?.getData("columnHeight") as string);
      const column = (columnList == 0 ? this.table.primaryKeyColumns[columnIndex] : this.table.columns[columnIndex]) as TableColumn;
      const dropZone = (list == 0 ? this.$refs.primaryKeyZone : this.$refs.nonPrimaryKeyZone) as HTMLElement;
      const dropZoneRect = dropZone.getBoundingClientRect() as DOMRect;
      const index = Math.floor((ev.clientY - dropZoneRect.y + columnHeight / 2) / columnHeight)

      if (columnList != list){
        this.table.removeColumn(column);
        column.primaryKey = !column.primaryKey;
        this.table.addColumnWithColumn(column, index);
      } else {
        if(columnList == 0)
          this.table.primaryKeyColumns.move(columnIndex, index);
        else
          this.table.columns.move(columnIndex, index);
      }
    },
    showExportCode(){
      this.code = this.erd.generateCode();
      this.exportCodeVisible = true;
    },
    downloadImage(filename = 'image') {
      console.log("convert img")
      const a = document.createElement('a');
      a.href = this.canvas.context.canvas.toDataURL("image/jpeg");
      a.download = `${filename}.jpeg`;
      document.body.appendChild(a);
      a.click();
    },
    zoom(scale:number) {
      this.erd.scale += scale;
    },
    zoomFitToContent(){
      this.erd.zoomFitToContent();
    },
    gridVisible(visible: boolean) {
      this.erd.gridVisible = visible;
    }
  },
  data() {
    return {
      contextMenuIsHidden: ref(true),
      contextMenuContent: ContextMenuContent.CanvasContextMenu,
      tableEditorIsHidden: ref(true),
      table: new Table(),
      erd: new Erd(),
      canvas: Canvas.getSingleton(),
      exportCodeVisible: ref(false),
      code: ref("")
    }
  },
  mounted() {
    const canvasElement = this.$refs.canvasElement as HTMLCanvasElement;
    const rootElement = this.$refs.root as HTMLElement;
    show(canvasElement, rootElement, this.erd as Erd);

    this.erd.addListener('edit-table', table => {
      this.table = table;
      const position = table.getGlobalPosition();
      this.showTableEditor(position.x, position.y);
    })

    this.erd.addListener('contextmenu', (pos, context: ContextMenuContent) => {
      this.contextMenuContent = context;
      this.showContextMenu(pos.x, pos.y);
      this.table = this.erd.table;
    })
  }
})

</script>

<template>
  <ExportCode v-model:visible="exportCodeVisible" v-model:code="code"/>
  <div class="canvas" ref="root">
    <canvas class="" id="myCanvas" ref="canvasElement"></canvas>

    <div class="right-click-menu" ref="menu" v-show="!contextMenuIsHidden">
      <ul v-if="contextMenuContent === ContextMenuContent.CanvasContextMenu">
        <li @click="addTable">add table</li>
        <li>sort</li>
      </ul>
      <ul v-if="contextMenuContent === ContextMenuContent.TableContextMenu">
        <li @click="erd.setReferencingMode()">add Relationship</li>
        <li @click="removeTable">remove</li>
        <li>sort</li>
      </ul>
      <ul v-if="contextMenuContent === ContextMenuContent.ReferenceContextMenu">
        <li @click="addTable">Convert</li>
        <li @click="()=> {showExportCode()}">sort</li>
      </ul>
    </div>

    <div id="table-editor" ref="tableEditor" v-show="!tableEditorIsHidden">
      <div class="header">
        <input class="table-name" @focusout="changeTableName" ref="tableName" v-model="table.name">
      </div>
      <div class="columns">
        <div class="pk-columns" @dragenter.prevent @dragover.prevent @drop="onDropColumn($event, 0)" ref="primaryKeyZone">
          <div class="column" v-for="(column, index) in table.primaryKeyColumns" v-bind:key="index">
            <span class="drag" draggable="true" @dragstart="startColumnDrag($event, 0, index)">:</span>
            <input v-model="column.name" placeholder="<Column Name>">
            <input v-model="column.type" placeholder="<Data Type>">
          </div>
          <div class="add_column">
            <input placeholder="<Column Name>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') table.addColumn({name:(ev.target as HTMLInputElement).value, primaryKey: true}); (ev.target as HTMLInputElement).value ='';}">
            <input placeholder="<Data Type>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') table.addColumn({type:(ev.target as HTMLInputElement).value, primaryKey: true}); (ev.target as HTMLInputElement).value ='';}">
          </div>
        </div>
        <hr style="width: 100%">
        <div class="non-pk-columns" @dragenter.prevent @dragover.prevent @drop="onDropColumn($event, 1)" ref="nonPrimaryKeyZone">
          <div class="column" v-for="(column, index) in table.columns" v-bind:key="index">
            <span class="drag" draggable="true" @dragstart="startColumnDrag($event, 1, index)">:</span>
            <input v-model="column.name" placeholder="<Column Name>">
            <input v-model="column.type" placeholder="<Data Type>">
          </div>
          <div class="add_column">
            <input placeholder="<Column Name>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') table.addColumn({name:(ev.target as HTMLInputElement).value}); (ev.target as HTMLInputElement).value ='';}">
            <input placeholder="<Data Type>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') table.addColumn({type:(ev.target as HTMLInputElement).value}); (ev.target as HTMLInputElement).value ='';}">
          </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.right-click-menu {
  position: absolute;
  top: 0;
  left: 0;
  background: #1c1e24;
  border: 1px solid #2d2f38;
  color: #828691;
  padding: 6px;
  border-radius: 4px;
  user-select: none;
}

#table-editor {
  position: absolute;
  top: 0;
  left: 0;
  background: #1c1e24;
}

#table-editor .columns {
  display: flex;
  flex-direction: column;
  padding: 4px;
  background: #2d2f38;
  border: #828691;
}

.pk-columns {
  display: flex;
  flex-direction: column;
}

.non-pk-columns {
  display: flex;
  flex-direction: column;
}

#table-editor .columns input {
  padding: 4px;
  margin: 2px;
  background: #25272d;
  border: 1px solid #828691;
  color: #b5b9be;
  font-size: 0.6em;
}

#table-editor .columns input:focus {
  border: 1px solid #c3c7d0;
  outline: none;
}

.column {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.column .drag {
  align-content: center;
  padding: 5px;
}

#table-editor .header {
  margin: 4px 17px 4px 19px;
}

.table-name{
  width: 100%;
  background: #1c1e24;
  border: 1px solid #828691;
  padding: 4px;
  color: #b5b9be;
}

.add_column {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 13px;
}
</style>