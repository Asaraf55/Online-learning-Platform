import React from 'react';
import { getCourseImage } from '../App';

export default function InstructorHub({ user, courses, globalMetrics, setActiveTab }) {
  const teacherCourses = courses.filter(c => c.instructor === user?.name);
  
  return (
    <div style={{animation: 'slide-up 0.4s ease-out'}}>
       <h1 className="page-title">Instructor Analytics Dashboard</h1>
       <p className="page-subtitle" style={{marginBottom: '30px'}}>Track your distributed content, analytics, and global student enrollment trajectories.</p>
       <button className="btn-primary" style={{marginBottom: '30px'}} onClick={() => setActiveTab('Propose Course')}>+ Draft New Content Series</button>
       
       <div className="course-grid">
         {teacherCourses.map(course => (
           <div key={course.id} className="course-card" style={{padding: 0, overflow: 'hidden', borderLeft: course.status === 'PENDING' ? '4px solid var(--warning)' : '4px solid var(--success)'}}>
             <div style={{height: '150px', width: '100%', backgroundImage: `url(${getCourseImage(course.title, course.category)})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
                <span className={course.status === 'PENDING' ? 'badge badge-pending' : 'badge badge-approved'} style={{position: 'absolute', top: '15px', right: '15px'}}>{course.status}</span>
             </div>
             <div style={{padding: '25px'}}>
               <h3>{course.title}</h3>
               <p style={{marginTop: '15px', color: 'var(--text-secondary)'}}>{course.description}</p>
               
               <div style={{marginTop: '25px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)'}}>
                 <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Global Student Enrollments</p>
                 <h2 style={{fontSize: '2rem', color: '#fff'}}>{globalMetrics[course.id] || 0}</h2>
               </div>
             </div>
           </div>
         ))}
         {teacherCourses.length === 0 && <p style={{color: 'var(--text-muted)'}}>You have not published any courses yet. Begin drafting content!</p>}
       </div>
    </div>
  );
}
