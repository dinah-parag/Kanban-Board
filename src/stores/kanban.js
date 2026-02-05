import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useKanbanStore = defineStore('kanban', () => {
  // Estado Inicial: 3 Colunas
  const columns = ref([
    {
      id: 'todo',
      title: '📅 A Fazer',
      tasks: [
        { id: 1, title: 'Alimentar gatos' },
        { id: 2, title: 'Praticar línguas' }
      ]
    },
    {
      id: 'doing',
      title: '💻 Fazendo',
      tasks: []
    },
    {
      id: 'done',
      title: '✅ Feito',
      tasks: []
    }
  ])

  // Ação: Adicionar Tarefa
  const addTask = (columnId, taskTitle) => {
    const column = columns.value.find(c => c.id === columnId)
    if (column) {
      column.tasks.push({
        id: Date.now(), // Gera ID único baseado no tempo
        title: taskTitle
      })
    }
  }

  // Ação: Deletar Tarefa
  const deleteTask = (columnId, taskId) => {
    const column = columns.value.find(c => c.id === columnId)
    if (column) {
      column.tasks = column.tasks.filter(t => t.id !== taskId)
    }
  }

  // Persistência: Salvar no LocalStorage sempre que algo mudar
  // O 'deep: true' é vital para observar mudanças DENTRO dos arrays
  if (localStorage.getItem('kanban_state')) {
    columns.value = JSON.parse(localStorage.getItem('kanban_state'))
  }

  watch(columns, (newVal) => {
    localStorage.setItem('kanban_state', JSON.stringify(newVal))
  }, { deep: true })

  return { columns, addTask, deleteTask }
})