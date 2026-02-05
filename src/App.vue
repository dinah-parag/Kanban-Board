<script setup>
import { ref } from 'vue'
import { useKanbanStore } from './stores/kanban'
import draggable from 'vuedraggable' 

const store = useKanbanStore()
const newTasks = ref({}) // Armazena o texto do input de cada coluna

const handleAddTask = (columnId) => {
  const title = newTasks.value[columnId]
  if (!title) return
  
  store.addTask(columnId, title)
  newTasks.value[columnId] = '' // Limpa o input
}
</script>

<template>
  <div class="board-wrapper">
    <h1 class="main-title">Kanban Board</h1>
    
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
              <span>{{ element.title }}</span>
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
.main-title { text-align: center; color: rgb(30, 81, 65); margin-bottom: 30px; }

.columns-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  align-items: flex-start; /* Importante para as colunas não esticarem */
}

.column {
  background: #a0c6c8;
  width: 300px;
  flex-shrink: 0; /* Impede a coluna de encolher */
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.column-title {
  font-size: 1rem;
  font-weight: bold;
  margin: 10px 0 15px 10px;
  color: #172b4d;
}

.draggable-area {
  min-height: 50px; 
}

.task-card {
  background: white;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-card:hover { background: #f4f5f7; }
.task-card:active { cursor: grabbing; }

/* Classe visual quando está arrastando (definido no ghost-class) */
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 2px dashed #0079bf;
}

.btn-delete {
  background: none; border: none; color: #6e3a3a; cursor: pointer; font-size: 1.2rem;
}
.btn-delete:hover { color: red; }

.add-task-box input {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}
.add-task-box input:focus {
  background: white;
  cursor: text;
  outline: 2px solid #0a2e42;
}

@media (max-width: 900px) {
  .columns-container {
    flex-direction: column; 
    align-items: stretch; 
    overflow-x: hidden; 
  }

  .column {
    width: 100%; 
    margin-bottom: 20px; 
  }

  .board-wrapper {
    padding: 20px; 
  }
}

</style>
