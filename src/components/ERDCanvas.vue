<script lang="ts">

import {show, Erd, ContextMenuContent} from "@/components/erd/erd";
import {defineComponent, ref} from "vue";
import {Table} from "@/components/erd/table";
import {Canvas} from "@/components/erd/basic/canvas";
import {TableColumn} from "@/components/erd/table-column";

export default defineComponent({
  computed: {
    ContextMenuContent() {
      return ContextMenuContent
    },
    TableColumn() {
      return TableColumn
    }
  },
  methods: {
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
    },
    changeTableName(ev: FocusEvent) {
      if (!ev.target) return;
      const target = ev.target as HTMLInputElement
      this.table.name = target.value; // TODO: check for duplicate table name
      target.value = "";
    },
  },
  data() {
    return {
      contextMenuIsHidden: ref(true),
      contextMenuContent: ContextMenuContent.CanvasContextMenu,
      tableEditorIsHidden: ref(true),
      table: new Table(""),
      erd: new Erd(),
      canvas: Canvas.getSingleton(),
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
  <div class="canvas" ref="root">
    <canvas class="" id="myCanvas" ref="canvasElement"></canvas>

    <div class="right-click-menu" ref="menu" v-show="!contextMenuIsHidden">
      <ul v-if="contextMenuContent === ContextMenuContent.CanvasContextMenu">
        <li @click="addTable">add table</li>
        <li>sort</li>
      </ul>
      <ul v-if="contextMenuContent === ContextMenuContent.TableContextMenu">
        <li @click="erd.setReferencingMode()">add Relationship</li>
        <li>sort</li>
      </ul>
      <ul v-if="contextMenuContent === ContextMenuContent.ReferenceContextMenu">
        <li @click="addTable">Convert</li>
        <li>sort</li>
      </ul>
    </div>

    <div id="table-editor" ref="tableEditor" v-show="!tableEditorIsHidden">
      <div>
        <input @focusout="changeTableName" ref="tableName" v-model="table.name">
      </div>
      <div class="columns">
        <div class="pk-columns">
          <input v-for="(column, index) in table.primaryKeyColumns" v-bind:key="index" v-model="column.name">
          <input
              @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') table.addColumn(new TableColumn((ev.target as HTMLInputElement).value).setPrimaryKey(true)); (ev.target as HTMLInputElement).value ='';}">
        </div>
        <hr style="width: 100%">
        <div class="non-pk-columns">
          <input v-for="(column, index) in table.columns" v-bind:key="index" v-model="column.name">
          <input
              @focusout="ev => {if((ev.target as HTMLInputElement).value.trim() !== '') table.addColumn(new TableColumn((ev.target as HTMLInputElement).value)); (ev.target as HTMLInputElement).value ='';}">
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
}

#table-editor .columns {
  display: flex;
  flex-direction: column;
  padding: 10px;
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
  margin: 2px 0;
  border: none;
}
</style>