<script setup>
import { ref } from 'vue'
import { useKanbanStore } from './stores/kanban'
import draggable from 'vuedraggable'

const store = useKanbanStore()
const newTasks = ref({}) 
const editingId = ref(null) // Controla qual tarefa está sendo editada agora

const handleAddTask = (columnId) => {
  const title = newTasks.value[columnId]
  if (!title) return
  store.addTask(columnId, title)
  newTasks.value[columnId] = ''
}

// Funções de Edição
const startEditing = (id) => {
  editingId.value = id
}
const saveEdit = () => {
  editingId.value = null // Apenas para de editar, o v-model já atualizou o store
}

// Função de Limpar com Confirmação
const confirmClear = () => {
  if (confirm("Tem certeza que deseja apagar TODAS as tarefas?")) {
    store.clearBoard()
  }
}
</script>

<template>
  <div class="board-wrapper">
    <div class="header">
      <h1 class="main-title">Kanban Pro</h1>
      <button @click="confirmClear" class="btn-clear-board">🗑️ Limpar Quadro</button>
    </div>
    
    <div class="columns-container">
      <div v-for="column in store.columns" :key="column.id" class="column">
        <h2 class="column-title">{{ column.title }}</h2>

        <draggable 
          v-model="column.tasks" 
          group="tasks" 
          item-key="id"
          class="draggable-area"
          animation="200"
          ghost-class="ghost"
        >
          <template #item="{ element }">
            <div class="task-card">
              
              <div 
                class="priority-dot" 
                :class="element.priority || 'normal'"
                @click.stop="store.cyclePriority(column.id, element.id)"
                title="Mudar Prioridade"
              ></div>

              <div class="content">
                <input 
                  v-if="editingId === element.id"
                  v-model="element.title"
                  @blur="saveEdit"
                  @keyup.enter="saveEdit"
                  class="edit-input"
                  autoFocus
                />
                <span 
                  v-else 
                  @dblclick="startEditing(element.id)"
                  class="task-text"
                >
                  {{ element.title }}
                </span>
              </div>

              <button @click="store.deleteTask(column.id, element.id)" class="btn-delete">×</button>
            </div>
          </template>
        </draggable>

        <div class="add-task-box">
          <input 
            v-model="newTasks[column.id]" 
            @keyup.enter="handleAddTask(column.id)"
            placeholder="+ Nova tarefa"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-wrapper {
  font-family: 'Segoe UI', sans-serif;
  padding: 40px;
  background-color: #809a5e;
  min-height: 100vh;
  color: #333;
}

/* Header com botão de limpar */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.main-title { color: rgb(30, 81, 65); margin: 0; }
.btn-clear-board {
  background: rgba(255, 255, 255, 0.2);
  color: rgb(105, 97, 97);
  border: 1px solid rgba(255,255,255,0.4);
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-clear-board:hover { background: rgba(255, 0, 0, 0.4); border-color: red; }

.columns-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  align-items: flex-start;
}

.column {
  background: #a0c6c8;
  width: 300px;
  flex-shrink: 0;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.column-title { font-size: 1rem; font-weight: bold; margin: 10px 0 15px 10px; color: #172b4d; }
.draggable-area { min-height: 50px; }

.task-card {
  background: rgb(255, 255, 255);
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.task-card:hover { background: #f4f5f7; }

/* Prioridades (Bolinhas) */
.priority-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.1);
}
.priority-dot:hover { transform: scale(1.2); }
.priority-dot.low { background-color: #61bd4f; } /* Verde */
.priority-dot.normal { background-color: #0079bf; } /* Azul */
.priority-dot.urgent { background-color: #eb5a46; } /* Vermelho */

.content { flex-grow: 1; display: flex; align-items: center; }
.task-text { cursor: text; width: 100%; word-break: break-all; }
.edit-input { width: 100%; padding: 4px; font-size: 1rem; border: 2px solid #0079bf; border-radius: 4px; }

.btn-delete { background: none; border: none; color: #888; cursor: pointer; font-size: 1.2rem; }
.btn-delete:hover { color: red; }
.add-task-box input { width: 100%; padding: 8px; border: none; background: transparent; cursor: pointer; border-radius: 4px; }
.add-task-box input:focus { background: rgb(45, 50, 48); cursor: text; outline: 2px solid #0079bf; }
.ghost { opacity: 0.5; background: #c8ebfb; border: 2px dashed #0079bf; }

/* Responsivo (Mantive o que fizemos antes) */
@media (max-width: 900px) {
  .columns-container { flex-direction: column; align-items: stretch; overflow-x: hidden; }
  .column { width: 100%; margin-bottom: 20px; }
  .board-wrapper { padding: 20px; }
}
</style>