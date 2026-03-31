import React, { useState } from 'react';
import CommentSection from './CommentSection';

const TaskCard = ({ task, members = [], onStatusChange, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(task._id, e.target.value);
  };

  const handleAssigneeChange = (e) => {
    e.stopPropagation();
    onStatusChange(task._id, task.status, e.target.value);
  };

  return (
    <>
      <div className="task-card" onClick={() => setShowModal(true)}>
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {task.description}
          </p>
        )}
        <div className="task-meta">
          <span className={`task-priority priority-${task.priority}`}>{task.priority}</span>
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="task-assignee">
          {task.assignedTo?.name ? `Assigned: ${task.assignedTo.name}` : 'Unassigned'}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            
            <div style={{ marginBottom: '1.5rem', paddingRight: '2rem', minWidth: 0 }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{task.title}</h2>
            </div>
            
            <div className="inline-meta">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</span>
                <select 
                  value={task.status} 
                  onChange={handleStatusChange}
                  style={{ background: 'var(--bg-color)' }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned To</span>
                <select
                  value={task.assignedTo?._id || ''}
                  onChange={handleAssigneeChange}
                  style={{ background: 'var(--bg-color)' }}
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due Date</span>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority</span>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border)', textTransform: 'capitalize' }}>
                  <span className={`priority-${task.priority}`}>{task.priority}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 className="section-heading">Description</h3>
              <div className="detail-panel">
                {task.description || <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No description provided.</span>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn-secondary" onClick={handleDelete} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                Delete Task
              </button>
            </div>

            <CommentSection taskId={task._id} />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
