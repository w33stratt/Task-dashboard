import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskTableComponent } from './components/task-table/task-table.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { KanbanComponent } from './components/kanban/kanban.component';

const routes: Routes = [
  { path: '', redirectTo: 'main-table', pathMatch: 'full' },
  { path: 'main-table', component: TaskTableComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'tasks', component: TaskTableComponent },  // Path for the task list
  { path: 'tasks/new', component: TaskFormComponent },  // Path for adding a new task
  { path: 'tasks/edit/:id', component: TaskFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
