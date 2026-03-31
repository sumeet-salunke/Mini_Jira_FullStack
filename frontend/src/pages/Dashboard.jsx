import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <Link to="/projects" className="btn-primary">+ New Project</Link>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-title">Total Projects</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>{data?.totalProjects || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Tasks Created</span>
          <span className="stat-value">{data?.totalTasks || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Assigned to Me</span>
          <span className="stat-value">{data?.myTasks || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Overdue Tasks</span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>{data?.overDueTasks || 0}</span>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Task Completion Status</h2>
      <div className="dashboard-grid" style={{ marginTop: '1rem' }}>
        <div className="stat-card" style={{ borderTop: '4px solid var(--primary)' }}>
          <span className="stat-title">To Do</span>
          <span className="stat-value">{data?.todo || 0}</span>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--warning)' }}>
          <span className="stat-title">In Progress</span>
          <span className="stat-value">{data?.inProgress || 0}</span>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--success)' }}>
          <span className="stat-title">Done</span>
          <span className="stat-value">{data?.done || 0}</span>
        </div>
      </div>

      {data?.recentTasks?.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Recently Assigned Tasks</h2>
          <div className="projects-grid">
            {data.recentTasks.map(task => (
              <div key={task._id} className="project-card" style={{ borderLeft: `4px solid var(--${task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'primary'})` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`task-status-badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                {task.project && (
                  <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                    Project: {task.project.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
