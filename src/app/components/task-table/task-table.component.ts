import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ColumnSummary, Task } from '../../models/task.model';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css'
})
export class TaskTableComponent implements OnInit {
  searchTerm = '';
  selectedPerson = '';

  statusList = ['Ready to start', 'In Progress', 'Done', 'Waiting for review', 'Pending Deploy', 'Stuck'];
  priorityList = ['Critical', 'Medium', 'High', 'Low', 'Best Effort'];
  typeList = ['Bug', 'Feature Enhancements', 'Other'];

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  uniqueDevelopers: string[] = [];

  totalEstimatedSP = 0;
  totalActualSP = 0;

  columnSummaries: ColumnSummary[] = [];

  sorts: { column: keyof Task; direction: 'asc' | 'desc' }[] = [];
  allDevelopers = ['Alice', 'Bob', 'Charlie', 'David'];


  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        ...task,
        developerString: task.developer.join(', ')
      }));
      this.filteredTasks = [...this.tasks];
      this.uniqueDevelopers = this.getUniqueDevelopers(this.tasks);
      this.calculateTotals();
      this.generateColumnSummaries();
    });
  }


  onSearchChange(): void {
    this.applyFilters();
  }

  onDeveloperChange(): void {
    this.applyFilters();
  }

  toggleSort(column: keyof Task): void {
    const existing = this.sorts.find(s => s.column === column);
    if (existing) {
      // Toggle direction or remove
      if (existing.direction === 'asc') {
        existing.direction = 'desc';
      } else {
        this.sorts = this.sorts.filter(s => s.column !== column);
      }
    } else {
      this.sorts.push({ column, direction: 'asc' });
    }

    this.applyFilters();
  }


  private applyFilters(): void {
    // Filter by search term and developer
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDeveloper = this.selectedPerson
        ? task.developer.includes(this.selectedPerson)
        : true;
      return matchesSearch && matchesDeveloper;
    });

    // Sort
    if (this.sorts.length > 0) {
      this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
        for (const { column, direction } of this.sorts) {
          const aVal = a[column];
          const bVal = b[column];

          if (aVal !== bVal) {
            const comparison =
              typeof aVal === 'number' && typeof bVal === 'number'
                ? aVal - bVal
                : String(aVal).localeCompare(String(bVal));

            return direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }


    this.calculateTotals();
    this.generateColumnSummaries();
  }

  getSortDirection(column: keyof Task): 'asc' | 'desc' | null {
    return this.sorts.find(s => s.column === column)?.direction || null;
  }


  private getUniqueDevelopers(tasks: Task[]): string[] {
    const allDevs = tasks.flatMap(task => task.developer);
    return Array.from(new Set(allDevs));
  }

  private calculateTotals(): void {
    this.totalEstimatedSP = this.filteredTasks.reduce((sum, task) => sum + task.estimatedSP, 0);
    this.totalActualSP = this.filteredTasks.reduce((sum, task) => sum + task.actualSP, 0);
  }

  private generateColumnSummaries(): void {
    const statusSummary = this.createSummary('Status', this.filteredTasks.map(t => t.status));
    const prioritySummary = this.createSummary('Priority', this.filteredTasks.map(t => t.priority));
    const typeSummary = this.createSummary('Type', this.filteredTasks.map(t => t.type));
    this.columnSummaries = [statusSummary, prioritySummary, typeSummary];
  }

  getStatusColor(status: string): string {
    const map: { [key: string]: string } = {
      'Ready to start': '#3b82f6',
      'In Progress': '#fbbf24',
      'Done': '#10b981',
      'Waiting for review': '#a855f7',
      'Pending Deploy': '#f97316',
      'Stuck': '#ef4444'
    };
    return map[status] || '#e5e7eb'; // default gray
  }

  getPriorityColor(priority: string): string {
    const map: { [key: string]: string } = {
      'Critical': '#b91c1c',
      'High': '#ef4444',
      'Medium': '#facc15',
      'Low': '#60a5fa',
      'Best Effort': '#9ca3af'
    };
    return map[priority] || '#e5e7eb';
  }

  getTypeColor(type: string): string {
    const map: { [key: string]: string } = {
      'Bug': '#f43f5e',
      'Feature Enhancements': '#3b82f6',
      'Other': '#6b7280'
    };
    return map[type] || '#e5e7eb';
  }


  private createSummary(label: string, values: string[]): ColumnSummary {
    const total = values.length;
    const countMap: { [key: string]: number } = {};
    values.forEach(v => countMap[v] = (countMap[v] || 0) + 1);

    const colors: { [key: string]: string } = {
      // Status
      'Ready to start': '#3b82f6',
      'In Progress': '#fbbf24',
      'Done': '#10b981',
      'Waiting for review': '#a855f7',
      'Pending Deploy': '#f97316',
      'Stuck': '#ef4444',

      // Priority
      'Critical': '#b91c1c',
      'High': '#ef4444',
      'Medium': '#facc15',
      'Low': '#60a5fa',
      'Best Effort': '#9ca3af',

      // Type
      'Bug': '#f43f5e',
      'Feature Enhancements': '#3b82f6',
      'Other': '#6b7280'
    };

    const items = Object.entries(countMap).map(([name, count]) => ({
      name,
      color: colors[name] || '#ccc',
      percentage: Math.round((count / total) * 100)
    }));

    return { label, items };
  }

  addNewTask(): void {
    const newTask: Task = {
      title: 'New Task',
      developer: [],
      status: 'Ready to start',
      priority: 'Medium',
      type: 'Other',
      date: new Date().toISOString(),
      estimatedSP: 0,
      actualSP: 0
    };

    this.tasks.unshift(newTask);
    this.filteredTasks = [...this.tasks];
    this.calculateTotals();
    this.generateColumnSummaries();
    this.uniqueDevelopers = this.getUniqueDevelopers(this.tasks);
  }

  onDeveloperBlur(task: any): void {
    task.developer = task.developerString
      ? task.developerString.split(',').map((d: string) => d.trim())
      : [];
    this.uniqueDevelopers = this.getUniqueDevelopers(this.tasks);
  }


}
