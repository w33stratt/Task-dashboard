import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Task } from "../models/task.model";

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = 'https://mocki.io/v1/9d9895f9-70eb-49d2-99f7-cb3dacca8a94';

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => {
                return response.data.map((item: any) => ({
                    title: item.title,
                    developer: item.developer.split(',').map((d: string) => d.trim()),
                    status: item.status,
                    priority: item.priority,
                    type: item.type,
                    date: item.date ?? new Date().toISOString(),
                    estimatedSP: item['Estimated SP'],
                    actualSP: item['Actual SP']
                })) as Task[];
            })
        );
    }

    addTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    // updateTask(task: Task): Observable<Task> {
    //     return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
    // }
}
