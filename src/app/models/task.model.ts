// task.model.ts
export interface Task {
    title: string;
    developer: string[];
    status: string;
    priority: string;
    type: string;
    date: string;
    estimatedSP: number;
    actualSP: number;
    [key: string]: string | number | undefined | string[];
}

export interface SummaryItem {
    name: string;
    color: string;
    percentage: number;
}

export interface ColumnSummary {
    label: string;
    items: SummaryItem[];
}