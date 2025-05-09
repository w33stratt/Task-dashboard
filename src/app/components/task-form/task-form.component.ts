import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<Task>();

  newTask: Task = {
    title: '',
    developer: [],
    priority: 'Medium',
    status: 'Ready to start',
    type: 'Feature Enhancements',
    estimatedSP: 0,
    actualSP: 0,
    date: new Date().toLocaleDateString('en-GB')
  };

  // Menambahkan tugas baru
  addTask() {
    this.taskAdded.emit(this.newTask);
    this.newTask = {
      title: '',
      developer: [],
      priority: 'Medium',
      status: 'Ready to start',
      type: 'Feature Enhancements',
      estimatedSP: 0,
      actualSP: 0,
      date: new Date().toLocaleDateString('en-GB')
    };
  }
}
