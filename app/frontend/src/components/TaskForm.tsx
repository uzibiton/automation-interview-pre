import React, { useState } from 'react';
import axios from 'axios';
import { getApiServiceUrl } from '../utils/config';

const API_SERVICE_URL = getApiServiceUrl();

interface TaskFormProps {
  token: string;
  onSuccess: () => void;
}

function TaskForm({ token, onSuccess }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${API_SERVICE_URL}/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}
      data-testid="task-form-container"
    >
      <h2 style={{ marginBottom: '20px' }}>Create New Task</h2>
      <form onSubmit={handleSubmit} data-testid="task-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            data-testid="task-form-title-input"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            data-testid="task-form-description-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
              data-testid="task-form-priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
              data-testid="task-form-status-select"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="form-control"
              value={formData.dueDate}
              onChange={handleChange}
              data-testid="task-form-due-date-input"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" data-testid="task-form-submit-button">
          Create Task
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
