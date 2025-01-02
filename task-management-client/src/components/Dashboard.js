import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, setAuthToken } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInUser, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task details

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    setAuthToken(token);

    axios
      .get(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        const isAdminUser = response.data.role === 'admin';
        setIsAdmin(isAdminUser);
        if (isAdminUser) {
          fetchUsers();
          fetchTasks();
        } else {
          fetchTasks();
        }
      })
      .catch((err) => {
        console.error('Error fetching user data', err);
        navigate('/');
      });
  }, [navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(response.data);
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(response.data);
  };

  const handleCreateUser = async () => {
    const token = localStorage.getItem('token');
    const user = { email, password, role };
    try {
      await axios.post(`${BASE_URL}/users`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User created successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error creating user', err);
      alert('Error creating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
      alert('Error deleting user');
    }
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem('token');
    const task = { title: taskTitle, description: taskDescription };
    try {
      await axios.post(`${BASE_URL}/tasks`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Task created successfully');
      fetchTasks();
    } catch (err) {
      console.error('Error creating task', err);
      alert('Error creating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task', err);
      alert('Error deleting task');
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${BASE_URL}/tasks/${taskId}/assign/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert('Task assigned successfully');
      fetchTasks();
    } catch (err) {
      console.error('Error assigning task', err);
      alert('Error assigning task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${BASE_URL}/tasks/${taskId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert('Task status updated successfully');
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status', err);
      alert('Error updating task status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleViewTaskDetails = (task) => {
    console.log(`s task-->>`);
    console.log(task);
    setSelectedTask(task);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <div>
          <u>
            <h3>LoggedIn User:</h3>
          </u>
          <h4>{loggedInUser?.email}</h4>
          <h5>[Role: {isAdmin ? 'Admin' : 'Normal User'}]</h5>
        </div>
      </div>

      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      {/* Tab Buttons for Admin */}
      {isAdmin && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: activeTab === 'users' ? '#0288d1' : '#ddd',
              color: activeTab === 'users' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: activeTab === 'tasks' ? '#0288d1' : '#ddd',
              color: activeTab === 'tasks' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Task Management
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'users' && isAdmin && (
        <div>
          <div style={{ padding: 10, backgroundColor: 'lightgreen' }}>
            <h3>Create New User</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <label>
              <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              &nbsp;Role
            </label>
            <br />
            <br />
            <button onClick={handleCreateUser}>Create User</button>
          </div>

          <div>
            <h3>Existing Users</h3>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.email} - {user.role === 'admin' ? 'Admin' : 'User'}
                  &nbsp;
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <div>
            <h3>Tasks</h3>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  {task.title} - {task.description} - Status: {task.status}
                  <br />
                  {isAdmin && (
                    <>
                      <select
                        onChange={(e) =>
                          handleAssignTask(task.id, e.target.value)
                        }
                        value={task.user_id || ''}
                      >
                        <option value="">Assign to User</option>
                        {users
                          .filter((user) => user.role !== 'admin')
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.email}
                            </option>
                          ))}
                      </select>
                      <button onClick={() => handleDeleteTask(task.id)}>
                        Delete Task
                      </button>
                    </>
                  )}
                  <button onClick={() => handleViewTaskDetails(task)}>
                    View Details
                  </button>
                  {(!isAdmin || loggedInUser.id === task.user_id) && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateTaskStatus(task.id, 'In Progress')
                        }
                      >
                        Start Task
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateTaskStatus(task.id, 'Completed')
                        }
                      >
                        Complete Task
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {isAdmin && (
            <div style={{ padding: 10, backgroundColor: 'lightgreen' }}>
              <h3>Create New Task</h3>
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <br />
              <br />
              <input
                type="text"
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <br />
              <br />
              <button onClick={handleCreateTask}>Create Task</button>
            </div>
          )}

          {/* Task Details Modal */}
          {selectedTask && (
            <div
              style={{ padding: 20, backgroundColor: '#f0f0f0', marginTop: 20 }}
            >
              <h3>Task Details</h3>
              <p>Title: {selectedTask.title}</p>
              <p>Description: {selectedTask.description}</p>
              <p>Status: {selectedTask.status}</p>
              <p>
                Assigned to:{' '}
                {!selectedTask.user
                  ? 'No user assigned'
                  : selectedTask.user.email}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
