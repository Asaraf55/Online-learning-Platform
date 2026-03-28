import React, { useState } from 'react';

export default function ProposeCourse({ user, courses, setCourses, setGlobalMetrics, setActiveTab }) {
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', price: '', category: 'Programming'
  });
  
  // Advanced Nested State Logic
  const [modules, setModules] = useState([
    { title: '', subtopics: [{ title: '', type: 'TEXT', content: '' }] }
  ]);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const addModule = () => {
    setModules([...modules, { title: '', subtopics: [{ title: '', type: 'TEXT', content: '' }] }]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addSubtopic = (moduleIndex) => {
    const newMods = [...modules];
    newMods[moduleIndex].subtopics.push({ title: '', type: 'TEXT', content: '' });
    setModules(newMods);
  };

  const removeSubtopic = (moduleIndex, subtopicIndex) => {
    const newMods = [...modules];
    newMods[moduleIndex].subtopics = newMods[moduleIndex].subtopics.filter((_, i) => i !== subtopicIndex);
    setModules(newMods);
  };

  const updateModuleTitle = (index, val) => {
    const newMods = [...modules];
    newMods[index].title = val;
    setModules(newMods);
  };

  const updateSubtopic = (moduleIndex, subtopicIndex, field, val) => {
    const newMods = [...modules];
    newMods[moduleIndex].subtopics[subtopicIndex][field] = val;
    setModules(newMods);
  };

  const submitProposeCourse = (e) => {
    e.preventDefault();
    
    // Admins bypass PENDING and go straight to APPROVED
    const autoApprove = user?.role === 'ADMIN';

    // Clean up empty modules
    const validModules = modules.filter(m => m.title.trim() !== '').map(m => ({
      ...m,
      subtopics: m.subtopics.filter(st => st.title.trim() !== '' && st.content.trim() !== '')
    })).filter(m => m.subtopics.length > 0);

    const newCourse = {
      id: courses.length + 1,
      title: courseForm.title,
      description: courseForm.description,
      instructor: user.name,
      price: courseForm.price,
      category: courseForm.category,
      status: autoApprove ? 'APPROVED' : 'PENDING',
      rating: 5.0, // Default for new courses
      content: validModules
    };
    
    setCourses([...courses, newCourse]);
    setGlobalMetrics(prev => ({ ...prev, [newCourse.id]: 0 })); 
    
    setFormMsg({ type: 'success', text: autoApprove ? "Course Published Successfully to Global Catalog!" : "Course Proposed Successfully! Pending Admin Approval." });
    setTimeout(() => {
      setFormMsg({ type: '', text: '' });
      setActiveTab('Courses');
    }, 2500);
  };

  return (
    <div style={{animation: 'slide-up 0.4s ease-out', maxWidth: '800px', margin: '0 auto'}}>
       <h1 className="page-title">{user?.role === 'ADMIN' ? 'Publish a New Course' : 'Propose a New Curriculum'}</h1>
       <p className="page-subtitle" style={{marginBottom: '30px'}}>
         {user?.role === 'ADMIN' ? 'Courses created by Admin are instantly published globally.' : 'Draft articles and videos to scale your influence globally.'}
       </p>
       
       {formMsg.text && (
          <div style={{ padding: '12px 15px', marginBottom: '25px', borderRadius: 'var(--radius-sm)', background: formMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: formMsg.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {formMsg.text}
          </div>
       )}

       <form onSubmit={submitProposeCourse} className="course-card" style={{padding: '40px'}}>
         <div className="form-group">
           <label>Course Title</label>
           <input placeholder="e.g., Advanced React Forms" required value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
         </div>
         <div className="form-group">
           <label>Global Description</label>
           <textarea placeholder="Summarize what engineering students will learn." required rows="3" style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)'}} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
         </div>
         <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
           <div className="form-group" style={{flex: 1}}>
              <label>Price ($)</label>
              <input type="number" step="0.01" required placeholder="0.00" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} />
           </div>
           <div className="form-group" style={{flex: 1}}>
              <label>Engineering Category</label>
              <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})}>
                <option value="Programming">Programming</option>
                <option value="DevOps">DevOps</option>
                <option value="Architecture">Architecture</option>
                <option value="Database">Database Management</option>
              </select>
           </div>
         </div>
         
         <div className="form-group" style={{marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
            <h3 style={{fontSize: '1.2rem', marginBottom: '15px'}}>Interactive Content Modules</h3>
            
            {modules.map((mod, index) => (
              <div key={index} style={{background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                  <h4 style={{margin: 0, color: 'var(--accent-solid)'}}>Module {index + 1}</h4>
                  {modules.length > 1 && (
                    <button type="button" className="btn-danger" style={{padding: '4px 10px', fontSize: '0.8rem'}} onClick={() => removeModule(index)}>Drop Module</button>
                  )}
                </div>
                
                <input 
                  placeholder="Module Header (e.g. Introduction to React)" 
                  required 
                  style={{width: '100%', padding: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}} 
                  value={mod.title} 
                  onChange={e => updateModuleTitle(index, e.target.value)} 
                />
                
                {/* Subtopics Rendering */}
                <div style={{paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.1)'}}>
                  {mod.subtopics.map((st, sIndex) => (
                    <div key={sIndex} style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)'}}>
                       <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                          <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Subtopic {index+1}.{sIndex+1}</span>
                          {mod.subtopics.length > 1 && (
                            <span style={{color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem'}} onClick={() => removeSubtopic(index, sIndex)}>Remove</span>
                          )}
                       </div>
                       
                       <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                         <input 
                           placeholder="Subtopic Title (e.g. 1.1 What are Hooks?)" 
                           required 
                           style={{flex: 2, padding: '10px', background: 'rgba(255,255,255,0.02)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}} 
                           value={st.title} 
                           onChange={e => updateSubtopic(index, sIndex, 'title', e.target.value)} 
                         />
                         <select 
                           style={{flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}}
                           value={st.type}
                           onChange={e => updateSubtopic(index, sIndex, 'type', e.target.value)}
                         >
                           <option value="TEXT">Text Markdown</option>
                           <option value="VIDEO">Video Embed URI</option>
                           <option value="DOC">Document Link</option>
                         </select>
                       </div>
                       
                       {st.type === 'TEXT' ? (
                         <textarea 
                           placeholder="Enter your lesson text..." 
                           required rows="3"
                           style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.02)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}} 
                           value={st.content} 
                           onChange={e => updateSubtopic(index, sIndex, 'content', e.target.value)} 
                         />
                       ) : (
                         <input 
                           placeholder={st.type === 'VIDEO' ? "https://www.youtube.com/embed/..." : "https://docs.google.com/..."}
                           required type="url"
                           style={{width: '100%', padding: '10px', background: 'rgba(16, 185, 129, 0.05)', color: '#fff', border: '1px solid var(--success)', borderRadius: '4px'}} 
                           value={st.content} 
                           onChange={e => updateSubtopic(index, sIndex, 'content', e.target.value)} 
                         />
                       )}
                    </div>
                  ))}
                  
                  <button type="button" className="btn-secondary" style={{padding: '6px 14px', fontSize: '0.85rem'}} onClick={() => addSubtopic(index)}>
                     + Add Subtopic to {mod.title || `Module ${index + 1}`}
                  </button>
                </div>
              </div>
            ))}
            
            <button type="button" className="btn-secondary" style={{width: '100%', padding: '15px', marginTop: '10px', borderStyle: 'dashed', background: 'transparent'}} onClick={addModule}>
               + Draft New Module Root
            </button>
         </div>
         <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '30px', padding: '15px', fontSize: '1.1rem'}}>
           {user?.role === 'ADMIN' ? 'Instantly Publish Course Curriculum' : 'Submit Course to Admin Queue'}
         </button>
       </form>
    </div>
  );
}
