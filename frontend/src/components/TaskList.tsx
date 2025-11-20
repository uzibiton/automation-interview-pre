import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiServiceUrl } from '../utils/config';

const API_SERVICE_URL = getApiServiceUrl();

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
}

interface TaskListProps {
  token: string;
  refreshKey: number;
  onUpdate: () => void;
}

function TaskList({ token, refreshKey, onUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_SERVICE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`${API_SERVICE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await axios.put(
        `${API_SERVICE_URL}/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No tasks yet. Create your first task!
        </p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-title">{task.title}</div>
              <span className={`task-status status-${task.status}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '10px' }}>{task.description}</p>
            <div style={{ fontSize: '12px', color: '#999' }}>
              Priority: <strong>{task.priority}</strong>
              {task.dueDate && (
                <span style={{ marginLeft: '15px' }}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="task-actions">
              {task.status !== 'completed' && (
                <button
                  onClick={() =>
                    updateStatus(task.id, task.status === 'pending' ? 'in_progress' : 'completed')
                  }
                  className="btn btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  {task.status === 'pending' ? 'Start' : 'Complete'}
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-secondary"
                style={{ fontSize: '12px', color: '#d32f2f' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
