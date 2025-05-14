import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  template: `
    <h2 mat-dialog-title>{{data ? 'Editar' : 'Nova'}} Tarefa</h2>
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" required>
          <mat-error *ngIf="taskForm.get('titulo')?.hasError('required')">
            Título é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="descricao" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Responsável</mat-label>
          <input matInput formControlName="responsavel" required>
          <mat-error *ngIf="taskForm.get('responsavel')?.hasError('required')">
            Responsável é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Prioridade</mat-label>
          <mat-select formControlName="prioridade" required>
            <mat-option value="BAIXA">Baixa</mat-option>
            <mat-option value="MEDIA">Média</mat-option>
            <mat-option value="ALTA">Alta</mat-option>
          </mat-select>
          <mat-error *ngIf="taskForm.get('prioridade')?.hasError('required')">
            Prioridade é obrigatória
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Prazo</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="deadline" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="taskForm.get('deadline')?.hasError('required')">
            Prazo é obrigatório
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
          {{data ? 'Salvar' : 'Criar'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      responsavel: ['', Validators.required],
      prioridade: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.taskForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      
      if (this.data) {
        this.taskService.updateTask(this.data.id!, task).subscribe({
          next: () => {
            this.snackBar.open('Tarefa atualizada com sucesso', 'Fechar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar tarefa', 'Fechar', {
              duration: 3000
            });
          }
        });
      } else {
        this.taskService.createTask(task).subscribe({
          next: () => {
            this.snackBar.open('Tarefa criada com sucesso', 'Fechar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Erro ao criar tarefa', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 