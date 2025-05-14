import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService, Task } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="task-list-container">
      <mat-toolbar color="primary">
        <span>Gerenciador de Tarefas</span>
        <span class="spacer"></span>
        <button mat-icon-button (click)="openTaskForm()">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-icon-button (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
        </button>
      </mat-toolbar>

      <div class="content">
        <table mat-table [dataSource]="tasks" class="mat-elevation-z8">
          <ng-container matColumnDef="titulo">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let task">{{task.titulo}}</td>
          </ng-container>

          <ng-container matColumnDef="descricao">
            <th mat-header-cell *matHeaderCellDef>Descrição</th>
            <td mat-cell *matCellDef="let task">{{task.descricao}}</td>
          </ng-container>

          <ng-container matColumnDef="responsavel">
            <th mat-header-cell *matHeaderCellDef>Responsável</th>
            <td mat-cell *matCellDef="let task">{{task.responsavel}}</td>
          </ng-container>

          <ng-container matColumnDef="prioridade">
            <th mat-header-cell *matHeaderCellDef>Prioridade</th>
            <td mat-cell *matCellDef="let task">{{task.prioridade}}</td>
          </ng-container>

          <ng-container matColumnDef="deadline">
            <th mat-header-cell *matHeaderCellDef>Prazo</th>
            <td mat-cell *matCellDef="let task">{{task.deadline | date}}</td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let task">
              <button mat-icon-button color="primary" (click)="editTask(task)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteTask(task)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
      flex: 1;
      overflow: auto;
    }
    table {
      width: 100%;
    }
    .mat-column-acoes {
      width: 120px;
      text-align: center;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['titulo', 'descricao', 'responsavel', 'prioridade', 'deadline', 'acoes'];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar tarefas', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  openTaskForm(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  editTask(task: Task): void {
    this.openTaskForm(task);
  }

  deleteTask(task: Task): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(task.id!).subscribe({
        next: () => {
          this.snackBar.open('Tarefa excluída com sucesso', 'Fechar', {
            duration: 3000
          });
          this.loadTasks();
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir tarefa', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  logout(): void {
    // Implementar logout
  }
} 