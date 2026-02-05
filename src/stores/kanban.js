import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useKanbanStore = defineStore('kanban', () => {
  // Estado Inicial
  const columns = ref([
    { 
      id: 'todo', 
      title: '📅 A Fazer', 
      tasks: [
        // --- ADICIONE TAREFAS DE EXEMPLO AQUI ---
        { id: 101, title: 'Alimentar gato', priority: 'urgent' },
        { id: 102, title: 'Paticar grego', priority: 'normal' }
      ] 
    },
    { 
      id: 'doing', 
      title: '💻 Fazendo', 
      tasks: [
        // --- PODE ADICIONAR NA COLUNA "FAZENDO" TAMBÉM ---
        { id: 201, title: 'Desenvolver layout responsivo', priority: 'low' }
      ] 
    },
    { 
      id: 'done', 
      title: '✅ Feito', 
      tasks: [] // Esta coluna começa vazia
    }
  ])

  // 1. Adicionar Tarefa
  const addTask = (columnId, taskTitle) => {
    const column = columns.value.find(c => c.id === columnId)
    if (column) {
      column.tasks.push({
        id: Date.now(),
        title: taskTitle,
        priority: 'normal' 
      })
    }
  }

  // 2. Deletar Tarefa
  const deleteTask = (columnId, taskId) => {
    const column = columns.value.find(c => c.id === columnId)
    if (column) {
      column.tasks = column.tasks.filter(t => t.id !== taskId)
    }
  }

  // 3. Atualizar Texto (Editar)
  const updateTask = (columnId, taskId, newTitle) => {
    const column = columns.value.find(c => c.id === columnId)
    const task = column.tasks.find(t => t.id === taskId)
    if (task) {
      task.title = newTitle
    }
  }

  // 4. Mudar Prioridade (Ciclo: Baixa -> Normal -> Urgente)
  const cyclePriority = (columnId, taskId) => {
    const column = columns.value.find(c => c.id === columnId)
    const task = column.tasks.find(t => t.id === taskId)
    if (!task) return

    const priorities = ['low', 'normal', 'urgent']
    const currentIndex = priorities.indexOf(task.priority || 'normal')
    const nextIndex = (currentIndex + 1) % priorities.length 
    task.priority = priorities[nextIndex]
  }

  // 5. Limpar Quadro Inteiro
  const clearBoard = () => {
    columns.value.forEach(col => col.tasks = [])
  }

  if (localStorage.getItem('kanban_state')) {
    columns.value = JSON.parse(localStorage.getItem('kanban_state'))
  }

  watch(columns, (newVal) => {
    localStorage.setItem('kanban_state', JSON.stringify(newVal))
  }, { deep: true })

  return { columns, addTask, deleteTask, updateTask, cyclePriority, clearBoard }
})