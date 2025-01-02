import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    userId: 0,
  });

  useEffect(() => {
    api.get('/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [tasks]);

  const handleCreateTask = () => {
    if (user?.role === 'admin') {
      api
        .post('/tasks', newTask)
        .then(() => {
          setNewTask({ title: '', description: '', deadline: '', userId: 0 });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleTaskStatusUpdate = (taskId, status) => {
    api
      .put(`/tasks/${taskId}/status`, { status })
      .then((response) => {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? response.data : task)));
      })
      .catch((err) => console.error(err));
  };

  const handleAssignTask = (taskId, userId) => {
    api
      .put(`/tasks/${taskId}/assign/${userId}`)
      .then((response) => setTasks((prev) => prev.map((task) => (task.id === taskId ? response.data : task))))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Task List</h2>
      <div>
        {user?.role === 'admin' && (
          <div>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <button onClick={handleCreateTask}>Create Task</button>
          </div>
        )}
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            {user?.role === 'admin' && (
              <div>
                <select
                  value={task.user ? task.user.id : ''}
                  onChange={(e) => handleAssignTask(task.id, Number(e.target.value))}
                >
                  <option value="">Assign to user</option>
                  {/* Populate users from the backend */}
                  <option value="1">User 1</option>
                  <option value="2">User 2</option>
                </select>
              </div>
            )}
            {user?.role === 'user' && task.user?.id === user.id && (
              <div>
                <button onClick={() => handleTaskStatusUpdate(task.id, 'Completed')}>Mark as Completed</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
