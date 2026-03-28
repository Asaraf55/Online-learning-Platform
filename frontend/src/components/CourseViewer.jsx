import React, { useState, useEffect, useMemo } from 'react';
import { getCourseImage } from '../App';

export default function CourseViewer({ courseId, courses }) {
  const activeCourse = courses.find(c => c.id === parseInt(courseId, 10));
  
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [completedSubtopics, setCompletedSubtopics] = useState([]);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  // Flatten the matrix to calculate linear navigation vectors
  const flatSubtopics = useMemo(() => {
    const flat = [];
    if (!activeCourse) return flat;
    (activeCourse.content || []).forEach(m => {
      (m.subtopics || []).forEach(s => flat.push({ ...s, moduleTitle: m.title }));
    });
    return flat;
  }, [activeCourse]);

  // Boot sequence: Intercept local storage and intelligently drop student at last position
  useEffect(() => {
    if (!activeCourse) return;
    const progressKey = `courseProgress_${activeCourse.id}`;
    const saved = JSON.parse(localStorage.getItem(progressKey) || '[]');
    setCompletedSubtopics(saved);
    
    if (flatSubtopics.length > 0) {
      const firstUncompleted = flatSubtopics.find(st => !saved.includes(st.title));
      if (firstUncompleted) {
        setActiveSubtopic(firstUncompleted);
      } else {
        // They completed everything previously. Render the last subtopic.
        setActiveSubtopic(flatSubtopics[flatSubtopics.length - 1]);
      }
    }
  }, [activeCourse, flatSubtopics]);

  if (!activeCourse) {
    return (
      <div style={{textAlign: 'center', padding: '100px', color: 'var(--danger)'}}>
         <h2>Critical Error 404: Valid Learning Resource Not Found</h2>
      </div>
    );
  }

  const courseContents = activeCourse.content || [];

  const handleMarkComplete = () => {
    const progressKey = `courseProgress_${activeCourse.id}`;
    const newCompleted = [...new Set([...completedSubtopics, activeSubtopic.title])];
    
    setCompletedSubtopics(newCompleted);
    localStorage.setItem(progressKey, JSON.stringify(newCompleted));

    const currentIndex = flatSubtopics.findIndex(st => st.title === activeSubtopic.title);
    
    if (currentIndex >= 0 && currentIndex < flatSubtopics.length - 1) {
       // Auto-route to the next module conceptually
       setActiveSubtopic(flatSubtopics[currentIndex + 1]);
    } else {
       // Sequence exhaustion - Trigger Celebration
       setIsCourseCompleted(true);
    }
  };

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const confettiParticles = Array.from({ length: 60 });

  return (
    <div style={{
      animation: 'slide-up 0.4s ease-out', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', 
      display: 'flex', flexDirection: 'column'
    }}>
      
      {/* Persistent Fullscreen CSS Celebration Overlay */}
      {isCourseCompleted && (
        <div className="completion-modal-overlay">
           <div className="confetti-container">
             {confettiParticles.map((_, i) => (
               <div key={i} className="confetti" style={{
                 left: `${Math.random() * 100}%`,
                 backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                 animationDelay: `${Math.random() * 4}s`,
                 animationDuration: `${3 + Math.random() * 2}s`
               }}></div>
             ))}
           </div>
           
           <div className="completion-modal-card">
              <div style={{fontSize: '5rem', marginBottom: '20px'}}>🎓</div>
              <h1 style={{fontSize: '2.5rem', marginBottom: '15px', color: '#fff', textShadow: '0 4px 15px rgba(0,0,0,0.5)'}}>Curriculum Mastered!</h1>
              <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '35px'}}>You have successfully processed all modules and strictly verified your engineering metrics.</p>
              <button className="btn-primary" style={{padding: '16px 32px', fontSize: '1.2rem', background: 'var(--success)'}} onClick={() => { setIsCourseCompleted(false); window.close(); }}>
                Return to Global Dashboard
              </button>
           </div>
        </div>
      )}

      {/* Top App Header / Focus Toggle */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <button className="btn-primary" style={{padding: '8px 16px', fontSize: '0.9rem'}} onClick={() => window.location.href = '/'}>
               🏠 Home
            </button>
            <h2 style={{fontSize: '1.2rem', margin: 0}}>{activeCourse.title}</h2>
            <span className="badge badge-approved" style={{fontSize: '0.7rem'}}>Enterprise License</span>
         </div>
         <div style={{display: 'flex', gap: '15px'}}>
            <button className="btn-secondary" style={{padding: '8px 16px', fontSize: '0.9rem'}} onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
               {isSidebarVisible ? '🗙 Focus Mode' : '☰ Exit Focus Mode'}
            </button>
         </div>
      </div>

      {/* Main Split-Pane Architecture */}
      <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
        
        {/* Left Nav Sidebar */}
        {isSidebarVisible && (
          <aside style={{width: '320px', background: 'rgba(0,0,0,0.05)', borderRight: '1px solid var(--border-subtle)', overflowY: 'auto', padding: '20px', transition: 'border-color 0.5s ease'}}>
             <h3 style={{fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px'}}>Course Modules</h3>
             
             {courseContents.length === 0 ? (
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>No syllabus drafted yet.</p>
             ) : (
                courseContents.map((mod, mIdx) => (
                  <div key={mIdx} style={{marginBottom: '25px'}}>
                     <h4 style={{color: 'var(--text-primary)', fontSize: '1rem', borderBottom: '1px solid var(--border-strong)', paddingBottom: '8px', marginBottom: '10px'}}>{mod.title}</h4>
                     <ul style={{listStyle: 'none', padding: 0}}>
                        {mod.subtopics?.map((sub, sIdx) => {
                           const isActive = activeSubtopic?.title === sub.title;
                           const isCompleted = completedSubtopics.includes(sub.title);
                           return (
                             <li 
                               key={sIdx} 
                               onClick={() => setActiveSubtopic(sub)}
                               style={{
                                  padding: '10px 15px', 
                                  cursor: 'pointer', 
                                  borderRadius: '6px', 
                                  marginBottom: '5px',
                                  fontSize: '0.95rem',
                                  transition: 'all 0.2s ease',
                                  background: isActive ? 'var(--accent-gradient)' : (isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'transparent'),
                                  color: isActive ? '#fff' : (isCompleted ? 'var(--success)' : 'var(--text-secondary)'),
                                  fontWeight: isActive ? '600' : '400',
                                  borderLeft: isActive ? '3px solid #fff' : (isCompleted ? '3px solid var(--success)' : '3px solid transparent')
                               }}
                             >
                                <span style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                                   <span>
                                     <span style={{marginRight: '8px', opacity: 0.7}}>
                                       {sub.type === 'VIDEO' ? '▶' : sub.type === 'DOC' ? '📄' : '📝'}
                                     </span>
                                     {sub.title}
                                   </span>
                                   {isCompleted && <span style={{marginLeft: '10px'}}>✅</span>}
                                </span>
                             </li>
                           );
                        })}
                     </ul>
                  </div>
                ))
             )}
          </aside>
        )}

        {/* Deep Content Rendering Pane */}
        <main style={{flex: 1, padding: '40px 60px', overflowY: 'auto', background: 'var(--bg-base)', transition: 'background-color 0.5s ease'}}>
           {!activeSubtopic ? (
             <div style={{textAlign: 'center', marginTop: '100px', padding: '40px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)'}}>
                <h2 style={{color: 'var(--text-muted)'}}>Select a subtopic from the sidebar to begin learning.</h2>
             </div>
           ) : (
             <div style={{maxWidth: '900px', margin: '0 auto', animation: 'slide-up 0.3s ease-out'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
                   <span className="badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-solid)'}}>{activeSubtopic.type} Payload</span>
                   <h1 style={{fontSize: '2.4rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2'}}>{activeSubtopic.title}</h1>
                </div>

                <div style={{padding: '30px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', transition: 'background-color 0.5s ease, border-color 0.5s ease'}}>
                   {/* Conditional Dynamic Rendering */}
                   {activeSubtopic.type === 'TEXT' && (
                     <div style={{fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap'}}>
                        {activeSubtopic.content}
                     </div>
                   )}

                   {activeSubtopic.type === 'VIDEO' && (
                     <div style={{aspectRatio: '16/9', width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)'}}>
                        <iframe 
                           src={activeSubtopic.content} 
                           title={activeSubtopic.title}
                           style={{width: '100%', height: '100%', border: 'none'}} 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                        ></iframe>
                     </div>
                   )}

                   {activeSubtopic.type === 'DOC' && (
                     <div style={{textAlign: 'center', padding: '60px 20px'}}>
                        <div style={{fontSize: '4rem', marginBottom: '20px'}}>📄</div>
                        <h2 style={{marginBottom: '20px'}}>External Resource Secured</h2>
                        <a href={activeSubtopic.content} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{display: 'inline-block', textDecoration: 'none', padding: '15px 30px', fontSize: '1.1rem'}}>
                           Access Document in Secure Tab
                        </a>
                     </div>
                   )}
                </div>
                
                <div style={{marginTop: '40px', padding: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'right'}}>
                   <button className="btn-success" onClick={handleMarkComplete}>Mark Sequence Complete & Continue</button>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
