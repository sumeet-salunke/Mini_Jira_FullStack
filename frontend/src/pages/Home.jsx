import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const features = [
  {
    code: 'PRJ',
    title: 'Projects',
    description: 'Organize work into structured projects with a clear view of scope and ownership.',
  },
  {
    code: 'TSK',
    title: 'Tasks',
    description: 'Break delivery into trackable tasks with due dates, priority, and status.',
  },
  {
    code: 'COM',
    title: 'Comments',
    description: 'Keep conversations attached to the task so context does not get lost.',
  },
  {
    code: 'DASH',
    title: 'Dashboard',
    description: 'See project health, workload, and progress from a single summary view.',
  },
];

const Home = () => {
  return (
    <>
      <section className="home-hero animate-fade-in">
        <div className="home-hero-content">
          <span className="home-kicker">Project control for small teams</span>
          <h1>Empower Your Team&apos;s Productivity</h1>
          <p>
            Mini Jira is a focused project workspace for planning, execution, and collaboration.
            Track tasks, manage projects, and keep delivery moving without unnecessary complexity.
          </p>
          <div className="home-hero-actions">
            <Link to="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="home-features">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Everything You Need</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.code}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
