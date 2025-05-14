package com.example.taskmanager.service;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.Task.Status;
import com.example.taskmanager.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    public List<Task> findAll() {
        return repository.findAll();
    }

    public List<Task> findByStatus(Status status) {
        return repository.findByStatus(status);
    }



    public Task create(Task task) {
        task.setStatus(Status.EM_ANDAMENTO);
        return repository.save(task);
    }

    public Task update(Long id, Task updatedTask) {
        Task task = repository.findById(id).orElseThrow();
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDeadline(updatedTask.getDeadline());
        task.setResponsible(updatedTask.getResponsible());
        return repository.save(task);
    }

    public Task markAsCompleted(Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com o ID: " + id));

        if (task.getStatus() != Status.CONCLUIDA) {
            task.setStatus(Status.CONCLUIDA);
            return repository.save(task);
        }
        return task; // Se já estiver concluída, retorna sem alterações
    }
}