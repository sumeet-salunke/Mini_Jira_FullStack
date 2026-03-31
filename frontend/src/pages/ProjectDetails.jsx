import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import TaskCard from '../components/TaskCard';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberActionLoading, setMemberActionLoading] = useState(false);
  
  // Create task modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'low', dueDate: '', assignedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjectData = useCallback(async () => {
    try {
      const pRes = await api.get(`/projects/${id}`);
      setProject(pRes.data);
      
      const tRes = await api.get(`/tasks/project/${id}`);
      setTasks(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'low', dueDate: '', assignedTo: '' });
      fetchProjectData();
    } catch (err) {
      console.error(err);
      alert('Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus, assignedTo = undefined) => {
    try {
      const payload = { status: newStatus };

      if (assignedTo !== undefined) {
        payload.assignedTo = assignedTo;
      }

      await api.put(`/tasks/${taskId}`, payload);
      fetchProjectData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProjectData();
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;

    setMemberActionLoading(true);
    try {
      const { data } = await api.post(`/projects/${id}/members`, { email: memberEmail.trim() });
      setProject(data.project);
      setMemberEmail('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add member');
    } finally {
      setMemberActionLoading(false);
    }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) return;

    setMemberActionLoading(true);
    try {
      const { data } = await api.delete(`/projects/${id}/members/${memberId}`);
      setProject(data.project);
      fetchProjectData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setMemberActionLoading(false);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!project) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Project not found or you don't have access.</div>;

  const members = project.members || [];
  const ownerId = project.owner?._id || project.owner;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="animate-fade-in content-stack">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/projects" className="soft-link">&larr; Back to Projects</Link>
      </div>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div style={{ minWidth: 0 }}>
          <h1 className="page-title">{project.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{project.description}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowTaskModal(true)}>+ Add Task</button>
      </div>

      <div className="project-meta-grid">
        <div className="project-team-panel">
          <div className="panel-header">
            <div>
              <h3>Project Team</h3>
              <p>Members here can be assigned to tasks.</p>
            </div>
          </div>

          <form onSubmit={addMember} className="member-form">
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Add member by email"
              disabled={memberActionLoading}
            />
            <button type="submit" className="btn-primary" disabled={memberActionLoading}>
              {memberActionLoading ? 'Saving...' : 'Add Member'}
            </button>
          </form>

          <div className="member-list">
            {members.map((member) => (
              <div key={member._id} className="member-card">
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.email}</span>
                </div>
                {member._id === ownerId ? (
                  <span className="task-status-badge badge-todo">Owner</span>
                ) : (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => removeMember(member._id)}
                    disabled={memberActionLoading}
                    style={{ color: 'var(--danger)' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="task-board">
        {/* To Do Column */}
        <div className="task-column todo">
          <div className="task-column-header">
            <span style={{ color: 'var(--primary)' }}>To Do</span>
            <span style={{ marginLeft: 'auto', background: 'var(--surface)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{todoTasks.length}</span>
          </div>
          <div className="task-list">
            {todoTasks.map(task => (
              <TaskCard key={task._id} task={task} members={members} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="task-column in-progress">
          <div className="task-column-header">
            <span style={{ color: 'var(--warning)' }}>In Progress</span>
            <span style={{ marginLeft: 'auto', background: 'var(--surface)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{inProgressTasks.length}</span>
          </div>
          <div className="task-list">
            {inProgressTasks.map(task => (
              <TaskCard key={task._id} task={task} members={members} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="task-column done">
          <div className="task-column-header">
            <span style={{ color: 'var(--success)' }}>Done</span>
            <span style={{ marginLeft: 'auto', background: 'var(--surface)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{doneTasks.length}</span>
          </div>
          <div className="task-list">
            {doneTasks.map(task => (
              <TaskCard key={task._id} task={task} members={members} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
            ))}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTaskModal(false)}>&times;</button>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required autoFocus placeholder="What needs to be done?"/>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Add details..."></textarea>
              </div>
              <div className="inline-meta" style={{ marginBottom: 0 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Assign To</label>
                  <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
