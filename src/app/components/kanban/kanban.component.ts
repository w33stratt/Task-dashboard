import { Component } from '@angular/core';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {

  tasks: Task[] = [];
  filteredTasks: { [status: string]: Task[] } = {};
  statusList: string[] = [
    'Ready to start',
    'In Progress',
    'Waiting for review',
    'Pending Deploy',
    'Done',
    'Stuck'
  ];

  searchTerm = '';
  selectedDeveloper = '';
  sortColumn = 'title';
  sortOptions = ['title', 'estimatedSP', 'actualSP'];
  developerList: string[] = [];
  showModal = false;

  ngOnInit() {
    // Fetch tasks from service or static for now
    this.tasks = this.getMockTasks();
    this.filterTasks();
    this.developerList = [...new Set(this.tasks.flatMap(t => t.developer))];
  }

  filterTasks() {
    const search = this.searchTerm.toLowerCase();
    this.filteredTasks = {};
    for (const status of this.statusList) {
      this.filteredTasks[status] = this.tasks
        .filter(t => t.status === status)
        .filter(t => t.title.toLowerCase().includes(search))
        .filter(t => this.selectedDeveloper ? t.developer.includes(this.selectedDeveloper) : true);
    }
  }

  sortTasks() {
    const col = this.sortColumn;
    this.tasks.sort((a, b) => {
      return String(a[col]).localeCompare(String(b[col]));
    });

    this.filterTasks();
  }

  openNewTaskModal() {
    this.showModal = true;
  }

  onSave(newTask: Task) {
    this.tasks.unshift(newTask);
    this.filterTasks();
    this.showModal = false;
  }

  getStatusColor(status: string): string {
    const map: any = {
      'Ready to start': '#2F80ED',
      'In Progress': '#F2994A',
      'Waiting for review': '#56CCF2',
      'Pending Deploy': '#BB6BD9',
      'Done': '#27AE60',
      'Stuck': '#EB5757'
    };
    return map[status] || '#999';
  }

  getPriorityColor(priority: string): string {
    const map: any = {
      'Critical': 'bg-red-600',
      'High': 'bg-orange-500',
      'Medium': 'bg-yellow-400',
      'Low': 'bg-green-400',
      'Best Effort': 'bg-gray-400'
    };
    return map[priority] || 'bg-gray-300';
  }

  getMockTasks(): Task[] {
    return [
      {
        title: 'Committed Feature',
        status: 'Ready to start',
        priority: 'High',
        type: 'Other',
        estimatedSP: 2,
        date: new Date().toISOString(),
        actualSP: 0,
        developer: ['John']
      },
      {
        title: 'New Task',
        status: 'In Progress',
        priority: 'Best Effort',
        type: 'Feature Enhancement',
        estimatedSP: 2,
        date: new Date().toISOString(),
        actualSP: 0,
        developer: []
      }
    ];
  }

}
