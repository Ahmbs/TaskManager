package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(Task.Status status); // Filtrar por status
    List<Task> findByResponsible(String responsible); // Filtrar por responsável

    default List<Task> findByStatus(Task.Status status)  // Query automática do Spring Data JPA
    {
        return null;
    }
}
