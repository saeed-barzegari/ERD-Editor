<script lang="ts">

import {show, Erd, ContextMenuContent} from "@/components/erd/erd";
import {defineComponent, ref} from "vue";
import {Table} from "@/components/erd/table";
import {Canvas} from "@/components/erd/basic/canvas";
import {TableColumn} from "@/components/erd/table-column";
import {diagramToMySQLCode} from "@/components/erd/code-generation/mysql";
import ExportCode from "@/components/ExportCode.vue";
import TextToggle from "@/components/TextToggle.vue";
import {useRoute} from "vue-router";

export default defineComponent({
  components: {TextToggle, ExportCode},
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
      const menu = this.$refs.menu as HTMLElement;
      if (menu) {
        this.contextMenuIsHidden = false;
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        const hideListener = () => {
          this.hideContextMenu();
          window.removeEventListener('click', hideListener);
        }
        window.addEventListener('click', hideListener)
        return false;
      }
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
      this.erd.removeTable(this.erd.table as Table);
    },
    changeTableName(ev: FocusEvent) {
      if (!ev.target) return;
      const target = ev.target as HTMLInputElement
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
      const column = (columnList == 0 ? this.erd.table?.primaryKeyColumns[columnIndex] : this.erd.table?.columns[columnIndex]) as TableColumn;
      const dropZone = (list == 0 ? this.$refs.primaryKeyZone : this.$refs.nonPrimaryKeyZone) as HTMLElement;
      const dropZoneRect = dropZone.getBoundingClientRect() as DOMRect;
      const index = Math.floor((ev.clientY - dropZoneRect.y + columnHeight / 2) / columnHeight)

      if (columnList != list){
        this.erd.table?.removeColumn(column);
        column.primaryKey = !column.primaryKey;
        this.erd.table?.addColumnWithColumn(column, index);
      } else {
        if(columnList == 0)
          this.erd.table?.primaryKeyColumns.move(columnIndex, index);
        else
          this.erd.table?.columns.move(columnIndex, index);
      }
    },
    showExportCode(){
      this.code = this.erd.generateCode();
      this.exportCodeVisible = true;
    },
    downloadImage(filename = 'image') {
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
    },
    importProject(project: object) {
      this.erd.importProject(project);
    },
    exportProject(){
      return this.erd.exportProject();
    },
    toggleGridVisible() {
      this.gridVisible(!this.erd.gridVisible)
    },
    differentBetweenVersions(project1: object, project2: object) {
      this.erd.differentBetweenVersions(project1, project2);
    }
  },
  data() {
    return {
      contextMenuIsHidden: ref(true),
      contextMenuContent: ContextMenuContent.CanvasContextMenu,
      tableEditorIsHidden: ref(true),
      erd: new Erd(),
      canvas: Canvas.getSingleton(),
      exportCodeVisible: ref(false),
      code: ref("")
    }
  },
  mounted() {
    const canvasElement = this.$refs.canvasElement as HTMLCanvasElement;
    const rootElement = this.$refs.root as HTMLElement;
    const route = useRoute();
    show(canvasElement, rootElement, this.erd as Erd);

    this.erd.addListener('edit-table', table => {
      const position = table.getGlobalPosition();
      this.showTableEditor(position.x, position.y);
    })

    if(route.name == 'editor') {
      this.erd.addListener('contextmenu', (pos, context: ContextMenuContent) => {
        this.contextMenuContent = context;
        this.showContextMenu(pos.x, pos.y);
      })
    }
  }
})

</script>

<template>
  <ExportCode v-model:visible="exportCodeVisible" v-model:code="code"/>
  <div class="canvas" ref="root">
    <canvas class="" id="myCanvas" ref="canvasElement"></canvas>

    <div class="right-click-menu" ref="menu" v-show="!contextMenuIsHidden">
      <ul v-if="contextMenuContent === ContextMenuContent.CanvasContextMenu">
        <li @click="addTable">Add Table</li>
        <li @click="zoomFitToContent">Zoom Fit To Content</li>
        <li @click="toggleGridVisible"><span v-if="erd.gridVisible">Hide Grid</span><span v-else>Show Grid</span></li>
        <li @click="showExportCode">Export Code</li>
        <li @click="downloadImage()">Export Image</li>
      </ul>
      <ul v-if="contextMenuContent === ContextMenuContent.TableContextMenu">
        <li @click="erd.setReferencingMode()">Add Relationship</li>
        <li @click="erd.table.addColumn()">Add Column</li>
        <li @click="removeTable">Remove</li>
      </ul>
      <ul v-if="contextMenuContent === ContextMenuContent.ReferenceContextMenu">
        <li @click="erd.removeActiveReference()">Remove</li>
      </ul>
    </div>

    <div id="table-editor" ref="tableEditor" v-show="!tableEditorIsHidden" v-if="erd.table != null">
      <div class="header">
        <input class="table-name" @focusout="changeTableName" ref="tableName" v-model="erd.table.name">
      </div>
      <div class="columns">
        <div class="pk-columns" @dragenter.prevent @dragover.prevent @drop="onDropColumn($event, 0)" ref="primaryKeyZone">
          <div class="column" v-for="(column, index) in erd.table.primaryKeyColumns" v-bind:key="index">
            <span class="drag" draggable="true" @dragstart="startColumnDrag($event, 0, index)">:</span>
            <input v-model="column.name" placeholder="<Column Name>">
            <input v-model="column.type" placeholder="<Data Type>">
            <div class="options">
              <TextToggle text="NULL" class="text-toggle" v-model:value="column.nullable"/>
              <TextToggle text="UNIQUE" class="text-toggle" v-model:value="column.unique"/>
            </div>
          </div>
          <div class="add_column">
            <input placeholder="<Column Name>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') erd.table.addColumn({name:(ev.target as HTMLInputElement).value, primaryKey: true}); (ev.target as HTMLInputElement).value ='';}">
            <input placeholder="<Data Type>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') erd.table.addColumn({type:(ev.target as HTMLInputElement).value, primaryKey: true}); (ev.target as HTMLInputElement).value ='';}">
          </div>
        </div>
        <hr style="width: 100%">
        <div class="non-pk-columns" @dragenter.prevent @dragover.prevent @drop="onDropColumn($event, 1)" ref="nonPrimaryKeyZone">
          <div class="column" v-for="(column, index) in erd.table.columns" v-bind:key="index">
            <span class="drag" draggable="true" @dragstart="startColumnDrag($event, 1, index)">:</span>
            <input v-model="column.name" placeholder="<Column Name>">
            <input v-model="column.type" placeholder="<Data Type>">
            <div class="options">
              <TextToggle text="NULL" class="text-toggle" v-model:value="column.nullable"/>
              <TextToggle text="UNIQUE" cl                                             ass="text-toggle" v-model:value="column.unique"/>
            </div>
          </div>
          <div class="add_column">
            <input placeholder="<Column Name>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') erd.table.addColumn({name:(ev.target as HTMLInputElement).value}); (ev.target as HTMLInputElement).value ='';}">
            <input placeholder="<Data Type>"
                   @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') erd.table.addColumn({type:(ev.target as HTMLInputElement).value}); (ev.target as HTMLInputElement).value ='';}">
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
  border-radius: 4px;
  user-select: none;
  min-width: 150px;
}

.right-click-menu > ul > li {
  margin: 4px 8px;
}

.right-click-menu > ul > li:hover {
  background: #5f6770;
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

.column .options {
  display: flex;
  align-items: center;
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
  margin-left: 13px;
}

.text-toggle {
  margin: 0 4px;
  font-size: 0.8em;
}

.text-toggle.enable {
  color: #b0aa26;
}

.text-toggle.disable {
  color: #6b6b6b;
}
</style>