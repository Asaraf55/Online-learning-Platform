import React, { useState, useEffect } from 'react';
import './index.css';

// Components
import AdminHub from './components/AdminHub';
import Mentorship from './components/Mentorship';
import ProposeCourse from './components/ProposeCourse';
import InstructorHub from './components/InstructorHub';
import CourseViewer from './components/CourseViewer';

export const getCourseImage = (title, category) => {
  const t = (title + (category || '')).toLowerCase();
  if (t.includes('java') || t.includes('spring')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600';
  if (t.includes('react') || t.includes('frontend')) return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600';
  if (t.includes('architecture') || t.includes('system')) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600';
  if (t.includes('docker') || t.includes('devops') || t.includes('kubernetes')) return 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=600';
  if (t.includes('database') || t.includes('sql')) return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600';
  const seeds = ['https://images.unsplash.com/photo-1498050108023-c5249f4df085', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd', 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'];
  return seeds[t.length % seeds.length] + '?auto=format&fit=crop&q=80&w=600';
};

const initialCoursesData = [
  { id: 1, title: 'GeeksForGeeks: Complete Core Java', description: 'Master Java from scratch spanning datatypes to multithreading Collections framework.', instructor: 'Sandeep Jain', price: '49.99', category: 'Backend', status: 'APPROVED', rating: 4.8, content: [
    { title: 'Module 1: What is Java?', subtopics: [
       { title: '1.1 Architecture & Hello World', type: 'VIDEO', content: 'https://www.youtube.com/embed/grEKMHGYyns?si=hM0qPZ0bI8g' },
       { title: '1.2 Setup Environment', type: 'DOC', content: 'https://docs.oracle.com/javase/tutorial/' }
    ]},
    { title: 'Module 2: Datatypes & Memory', subtopics: [
       { title: '2.1 Stack vs Heap', type: 'TEXT', content: 'The JVM manages two main memory areas: the Stack (used for method execution and primitive local variables) and the Heap (used for dynamically allocated objects). When you call a method, a new block is pushed to the stack...' }
    ]}
  ]},
  { id: 2, title: 'React Masterclass', description: 'Build stunning interactive web user interfaces with React 18 & Hooks.', instructor: 'Jane Smith', price: '59.99', category: 'Frontend', status: 'APPROVED', rating: 4.9, content: [
    { title: 'Module 1: React Fundamentals', subtopics: [
       { title: '1.1 Components & Props', type: 'TEXT', content: 'React components are modular UI blocks that accept dynamic parameters known as props.' }
    ]}
  ]},
  { id: 3, title: 'Enterprise Architecture', description: 'Learn system design and architecture for scalable microservices.', instructor: 'Alan Turing', price: '89.99', category: 'Architecture', status: 'APPROVED', rating: 4.5, content: [] },
];

const mockUsersData = [
  { id: 101, name: 'Sandeep Jain', email: 'sandeep@teacher.com', role: 'TEACHER', enrolledCount: 0 },
  { id: 104, name: 'System Admin', email: 'admin@platform.com', role: 'ADMIN', enrolledCount: 0 }
];

const API_BASE = import.meta.env.VITE_API_URL || '';

function App() {
  const [activeTab, setActiveTabRaw] = useState('Home');
  const setActiveTab = (tab) => {
    setActiveTabRaw(tab);
    const slug = tab.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (window.location.pathname !== '/' + slug) {
       window.history.pushState(null, '', '/' + (slug === 'home' ? '' : slug));
    }
  };

  const [courses, setCourses] = useState(initialCoursesData);
  const [usersDb, setUsersDb] = useState(mockUsersData);
  const [user, setUser] = useState(null); 
  
  // Persisted Enrollments Fix
  const [enrollments, setEnrollments] = useState(() => {
     return JSON.parse(localStorage.getItem('my_enrollments') || '[]');
  });

  const [globalMetrics, setGlobalMetrics] = useState({ 1: 4500, 2: 1250, 3: 840 });
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [fullscreenCourseId, setFullscreenCourseId] = useState(null);
  
  const [courseSearchText, setCourseSearchText] = useState('');
  
  // Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });

  // Auth State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' });
  const [authForm, setAuthForm] = useState({ role: 'STUDENT', firstName: '', lastName: '', email: '', password: '', confirmPassword: '', institution: '', adminCode: '', resetToken: '' });

  // Boot Effect
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      if (path === '') setActiveTabRaw('Home');
      else if (path === 'auth') setActiveTabRaw('Auth');
      else if (path === 'courses') setActiveTabRaw('Courses');
      else if (path.includes('propose')) setActiveTabRaw('Propose Course');
      else if (path.includes('instructor')) setActiveTabRaw('Instructor Hub');
      else if (path.includes('admin')) setActiveTabRaw('Admin Hub');
      else if (path.includes('mentorship')) setActiveTabRaw('Mentorship & Solutions');
      else if (path.includes('enrollments')) setActiveTabRaw('My Enrollments');
      else setActiveTabRaw('Home');
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Map activeTab gracefully routing user URLs.

    const params = new URLSearchParams(window.location.search);
    const tokenParams = params.get('token');
    const courseViewParam = params.get('courseViewer');
    
    // Explicit Full-Screen Native Rendering Mode
    if (courseViewParam) {
       setFullscreenCourseId(courseViewParam);
       return; // Lock interface entirely restricting navigation
    }
    
    // Explicit Password Reset Mode
    if (tokenParams || window.location.pathname.includes('reset-password')) {
      if (tokenParams) setAuthForm(prev => ({ ...prev, resetToken: tokenParams }));
      setIsResetPasswordMode(true); setIsForgotPasswordMode(false); setIsLoginMode(false); setActiveTab('Auth');
    }
  }, []);

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: '', text: '' });
    if (authForm.password !== authForm.confirmPassword) return setAuthMessage({ type: 'error', text: 'Passwords do not match!' });
    
    // Security check omitted for brevity in UI layer, assuming backend strictness
    try {
      const res = await fetch(`${API_BASE}/api/students/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authForm.resetToken, newPassword: authForm.password })
      });
      if (!res.ok) throw new Error("Failed to finalize password reset.");
      setAuthMessage({ type: 'success', text: "Your password was successfully updated!" });
      setTimeout(() => { 
        setIsResetPasswordMode(false); setIsLoginMode(true); window.history.replaceState({}, document.title, "/"); setAuthMessage({ type: '', text: '' }); 
      }, 3000);
    } catch (error) { setAuthMessage({ type: 'error', text: error.message }); }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: '', text: '' });
    try {
      await fetch(`${API_BASE}/api/students/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email })
      });
      setAuthMessage({ type: 'success', text: "Verification tokens wired natively to Notification Queue!" });
      setTimeout(() => { setIsForgotPasswordMode(false); setIsLoginMode(true); setAuthMessage({ type: '', text: '' }); }, 3500);
    } catch (error) { setAuthMessage({ type: 'error', text: "Backend routing error." }); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: '', text: '' });
    const endpoint = isLoginMode ? `${API_BASE}/api/students/login` : `${API_BASE}/api/students/register`;
    
    if (!isLoginMode) {
      if (authForm.role === 'ADMIN' && authForm.adminCode !== 'WEARETOGETHER') return setAuthMessage({ type: 'error', text: 'Invalid Admin Authorization Code!' });
      if (authForm.role === 'TEACHER' && !authForm.institution) return setAuthMessage({ type: 'error', text: 'Institution strictly required!' });
    }

    try {
      const payload = isLoginMode 
        ? { email: authForm.email, password: authForm.password }
        : { email: authForm.email, password: authForm.password, firstName: authForm.firstName || "New", lastName: authForm.lastName || "User", role: authForm.role, phoneNo: "", institution: authForm.institution || "", adminCode: authForm.adminCode || "" };

      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const rawErr = await res.text();
        try {
          const jsonErr = JSON.parse(rawErr);
          throw new Error(jsonErr.message || jsonErr.error || "Authentication verification failed.");
        } catch(e) {
          if (e.message.includes("is not valid JSON") || e.message.includes("Unexpected token")) {
            throw new Error("Invalid credentials or authentication route timeout.");
          }
          throw e; // Bubble JSON parsed error
        }
      }
      
      const data = await res.json();
      
      if (!isLoginMode) {
        setUsersDb([...usersDb, { id: usersDb.length + 101, name: data.firstName + ' ' + data.lastName, email: authForm.email, role: authForm.role, enrolledCount: 0 }]);
      }

      localStorage.setItem('jwtToken', data.token);
      const userProfile = { name: data.firstName + ' ' + data.lastName, role: data.role, email: data.email };
      localStorage.setItem('user', JSON.stringify(userProfile));
      setUser(userProfile);
      setAuthMessage({ type: 'success', text: `Welcome! Security payload verified.` });
      
      setTimeout(() => { setActiveTab('Courses'); setAuthMessage({ type: '', text: '' }); }, 1000);
    } catch (error) { setAuthMessage({ type: 'error', text: "Auth Exception: " + error.message }); }
  };

  const logout = () => { localStorage.clear(); setUser(null); setEnrollments([]); setActiveTab('Home'); };

  const handleEnroll = (course) => {
    if (!user) setActiveTab('Auth');
    else {
      // Secure local perseverance
      const newEnrolls = [...enrollments, course.id];
      setEnrollments(newEnrolls);
      localStorage.setItem('my_enrollments', JSON.stringify(newEnrolls));
      
      setGlobalMetrics({...globalMetrics, [course.id]: (globalMetrics[course.id] || 0) + 1});
    }
  };

  // Immediate Return For New-Tab Video UI Render!
  if (fullscreenCourseId) {
    return <CourseViewer courseId={fullscreenCourseId} courses={courses} />;
  }

  const renderContent = () => {
    // 2. Auth Flow Blocks
    if (activeTab === 'Auth') {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
          <div className="auth-container">
            <div style={{textAlign: 'center', marginBottom: '30px'}}>
              <h2 style={{fontSize: '2rem', fontWeight: '800', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                {isResetPasswordMode ? 'Secure Protocol' : (isForgotPasswordMode ? 'Account Recovery' : (isLoginMode ? 'Welcome Back' : 'Join the Platform'))}
              </h2>
            </div>
            
            {authMessage.text && (
              <div style={{ padding: '12px 15px', marginBottom: '20px', borderRadius: 'var(--radius-sm)', background: authMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: authMessage.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
                {authMessage.text}
              </div>
            )}
            
            {isResetPasswordMode ? (
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group"><label>Commit New Password</label><input type="password" required onChange={e => setAuthForm({...authForm, password: e.target.value})}/></div>
                <div className="form-group"><label>Confirm Password</label><input type="password" required onChange={e => setAuthForm({...authForm, confirmPassword: e.target.value})}/></div>
                <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>Finalize Overwrites</button>
              </form>
            ) : isForgotPasswordMode ? (
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group"><label>Registered Email</label><input type="email" required onChange={e => setAuthForm({...authForm, email: e.target.value})}/></div>
                <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>Request Secure Link</button>
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                  <a href="#" style={{color: 'var(--accent-solid)', textDecoration: 'none'}} onClick={(e) => { e.preventDefault(); setAuthMessage({type:'',text:''}); setIsForgotPasswordMode(false); setIsLoginMode(true); }}>&#8592; Back to Authentication</a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAuthSubmit}>
                {!isLoginMode && (
                  <div className="form-group"><label>Identify As</label><select value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})}><option value="STUDENT">Student</option><option value="TEACHER">Instructor</option><option value="ADMIN">System Admin</option></select></div>
                )}
                {!isLoginMode && (
                  <div style={{display: 'flex', gap: '10px'}}><div className="form-group" style={{flex: 1}}><label>First Name</label><input required onChange={e => setAuthForm({...authForm, firstName: e.target.value})}/></div><div className="form-group" style={{flex: 1}}><label>Last Name</label><input required onChange={e => setAuthForm({...authForm, lastName: e.target.value})}/></div></div>
                )}
                <div className="form-group"><label>Email</label><input type="email" required onChange={e => setAuthForm({...authForm, email: e.target.value})}/></div>
                <div className="form-group"><label>Password</label><input type="password" required onChange={e => setAuthForm({...authForm, password: e.target.value})}/></div>
                
                {!isLoginMode && authForm.role === 'TEACHER' && (<div className="form-group"><label>Institution Name</label><input required onChange={e => setAuthForm({...authForm, institution: e.target.value})}/></div>)}
                {!isLoginMode && authForm.role === 'ADMIN' && (<div className="form-group"><label>Admin Passphrase</label><input type="password" required onChange={e => setAuthForm({...authForm, adminCode: e.target.value})}/></div>)}
                
                {isLoginMode && (
                  <div style={{textAlign: 'right', marginBottom: '15px'}}>
                    <a href="#" style={{fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none'}} onClick={(e) => { e.preventDefault(); setAuthMessage({type:'',text:''}); setIsForgotPasswordMode(true); setIsLoginMode(false); }}>Forgot Password?</a>
                  </div>
                )}
                <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>{isLoginMode ? 'Secure Login' : 'Secure Registration'}</button>
              </form>
            )}

            {!isForgotPasswordMode && !isResetPasswordMode && (
              <div style={{marginTop: '20px', textAlign: 'center'}}>
                <a href="#" style={{color: 'var(--accent-solid)', textDecoration: 'none', fontWeight: 'bold'}} onClick={(e) => { e.preventDefault(); setAuthMessage({type:'',text:''}); setIsLoginMode(!isLoginMode); }}> {isLoginMode ? "Create a new account" : "Log in to existing account"} </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    const rawDisplayCourses = user?.role === 'ADMIN' ? courses : courses.filter(c => c.status === 'APPROVED');
    
    // Search Filtering Protocol
    const searchToken = courseSearchText.trim().toLowerCase();
    const displayCourses = searchToken 
         ? rawDisplayCourses.filter(c => c.title.toLowerCase().includes(searchToken) || c.category.toLowerCase().includes(searchToken))
         : rawDisplayCourses;

    switch(activeTab) {
      case 'Home':
        return (
          <div style={{animation: 'slide-up 0.4s ease-out'}}>
            {/* Hero Section */}
            <div style={{
               textAlign: 'center', padding: '100px 20px', 
               backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), var(--bg-main)), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000)',
               backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '0 0 20px 20px', marginBottom: '60px'
            }}>
              <h1 style={{fontSize: '4.5rem', fontWeight: '800', marginBottom: '20px', color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>The Ultimate Engineering Platform</h1>
              <p style={{fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', marginBottom: '50px', maxWidth: '800px', margin: '0 auto 50px auto', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
                Transform your career with enterprise-grade curriculum. From distributed systems architecture to full-stack reactive frontends, learn directly from top industry professionals.
              </p>
              <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
                <button className="btn-primary" style={{padding: '16px 32px', fontSize: '1.1rem'}} onClick={() => setActiveTab('Courses')}>Explore Curriculum Catalog</button>
                {!user && <button className="btn-secondary" style={{padding: '16px 32px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}} onClick={() => { setIsForgotPasswordMode(false); setIsResetPasswordMode(false); setIsLoginMode(false); setActiveTab('Auth'); }}>Enroll As Student</button>}
              </div>
            </div>

            {/* Features Section */}
            <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '80px'}}>
               <div className="course-card" style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '3rem', marginBottom: '20px'}}>🚀</div>
                  <h3 style={{fontSize: '1.5rem', marginBottom: '15px'}}>Scale Your Skills</h3>
                  <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>Master the precise frameworks and methodologies deployed by Fortune 500 tech firms.</p>
               </div>
               <div className="course-card" style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '3rem', marginBottom: '20px'}}>👨‍🏫</div>
                  <h3 style={{fontSize: '1.5rem', marginBottom: '15px'}}>Interactive Mentorship</h3>
                  <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>Don't learn in isolation. Request 1-on-1 Zoom sessions with system administrators securely.</p>
               </div>
               <div className="course-card" style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '3rem', marginBottom: '20px'}}>💻</div>
                  <h3 style={{fontSize: '1.5rem', marginBottom: '15px'}}>Publish & Instruct</h3>
                  <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>Are you an expert? Sign up as a Teacher and publish high-quality multimedia modules instantly.</p>
               </div>
            </div>

            {/* Footer / Contact Support Nav */}
            <footer style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', paddingBottom: '40px', textAlign: 'center'}}>
               <h3 style={{marginBottom: '20px', color: '#fff'}}>Geeks Learning.io &copy; 2026</h3>
               <div style={{display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '20px'}}>
                 <a href="#" style={{color: 'var(--text-secondary)', textDecoration: 'none'}} onClick={(e) => { e.preventDefault(); setActiveTab('Mentorship & Solutions'); }}>Contact Technical Support</a>
                 <a href="#" style={{color: 'var(--text-secondary)', textDecoration: 'none'}} onClick={(e) => { e.preventDefault(); setActiveTab('Mentorship & Solutions'); }}>Request Mentorship</a>
                 <a href="#" style={{color: 'var(--text-secondary)', textDecoration: 'none'}} onClick={(e) => { e.preventDefault(); setActiveTab('Home'); }}>Platform Architecture</a>
               </div>
               <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Enterprise deployments and academic instances strictly monitored. All rights reserved.</p>
            </footer>
          </div>
        );

      case 'Propose Course':
        return <ProposeCourse user={user} courses={courses} setCourses={setCourses} setGlobalMetrics={setGlobalMetrics} setActiveTab={setActiveTab} />;
      case 'Instructor Hub':
        return <InstructorHub user={user} courses={courses} globalMetrics={globalMetrics} setActiveTab={setActiveTab} />;
      case 'Admin Hub':
        return <AdminHub usersDb={usersDb} setUsersDb={setUsersDb} confirmModal={confirmModal} setConfirmModal={setConfirmModal} mentorshipRequests={mentorshipRequests} setMentorshipRequests={setMentorshipRequests} />;
      case 'Mentorship & Solutions':
        return <Mentorship user={user} mentorshipRequests={mentorshipRequests} setMentorshipRequests={setMentorshipRequests} />;

      case 'Courses':
        return (
          <div style={{animation: 'slide-up 0.4s ease-out'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px'}}>
               <div><h1 className="page-title">Course Catalog</h1></div>
               {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && <button className="btn-primary" onClick={() => setActiveTab('Propose Course')}>+ Propose New Course</button>}
            </div>

            {/* Powerful Interactive Search Bar */}
            <div style={{marginBottom: '40px'}}>
               <input 
                 type="text" 
                 placeholder="Search curriculum by title or underlying category engineering context..." 
                 value={courseSearchText} 
                 onChange={(e) => setCourseSearchText(e.target.value)}
                 style={{width: '100%', padding: '18px 24px', fontSize: '1.2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'}}
               />
               
               {/* Suggestion Engine Implementation */}
               {searchToken && displayCourses.filter(c => c.rating >= 4.5).length > 0 && (
                 <div style={{marginTop: '20px'}}>
                   <h3 style={{color: 'var(--accent-solid)', fontSize: '1.05rem', marginBottom: '10px'}}>🌟 Highly Rated Suggestions Matching Your Search Query:</h3>
                   <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                     {displayCourses.filter(c => c.rating >= 4.5).slice(0, 3).map(sug => (
                       <div key={'sug_'+sug.id} style={{padding: '12px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', whiteSpace: 'nowrap', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                         <strong style={{color: '#fff'}}>{sug.title}</strong> • <span style={{color: 'var(--warning)'}}>★ {sug.rating}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            <div className="course-grid">
              {displayCourses.map(course => {
                const isEnrolled = enrollments.includes(course.id);
                const isPending = course.status === 'PENDING';
                return (
                  <div key={course.id} className="course-card" style={{ ...(isPending ? {borderStyle: 'dashed', borderColor: 'var(--warning)', borderWidth: '2px'} : {}), padding: 0, overflow: 'hidden' }}>
                    
                    {/* Course Dynamic Image Header */}
                    <div style={{height: '180px', width: '100%', backgroundImage: `url(${getCourseImage(course.title, course.category)})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
                        {isPending && <div style={{position: 'absolute', top: '15px', right: '15px'}}><span className="badge badge-pending">Review Pending</span></div>}
                        {!isPending && user?.role === 'ADMIN' && <div style={{position: 'absolute', top: '15px', right: '15px'}}><span className="badge badge-approved">Live</span></div>}
                    </div>

                    <div style={{padding: '25px'}}>
                      <h3 style={{lineHeight: '1.3'}}>{course.title}</h3>
                      <p style={{marginTop: '10px'}}>{course.description}</p>
                      <div style={{marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>{course.instructor} &bull; {course.category} {course.rating && <span style={{color: 'var(--warning)', marginLeft: '8px'}}>★ {course.rating}</span>}</span>
                        <span style={{color: '#fff', fontWeight: '700', fontSize: '1.1rem'}}>${course.price}</span>
                      </div>
                      {(user?.role === 'ADMIN' || (user?.role === 'TEACHER' && course.instructor === user?.name)) && (
                        <div style={{marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px'}}><span style={{color: 'var(--text-muted)'}}>Active Subscribers: <strong style={{color: '#fff'}}>{globalMetrics[course.id] || 0}</strong> students</span></div>
                      )}
                      
                      <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)'}}>
                        {user?.role === 'ADMIN' ? (
                          <div style={{display: 'flex', gap: '10px'}}>
                            {isPending && <button className="btn-success" style={{flex: 1}} onClick={() => setConfirmModal({isOpen: true, type: 'success', title: 'Approve Curriculum', message: `Officially publish "${course.title}"?`, onConfirm: () => setCourses(courses.map(c => c.id === course.id ? {...c, status: 'APPROVED'} : c))})}>Approve</button>}
                            <button className="btn-danger" style={{flex: 1}} onClick={() => setConfirmModal({isOpen: true, type: 'danger', title: 'Drop Course', message: `Permanently delete "${course.title}"?`, onConfirm: () => setCourses(courses.filter(c => c.id !== course.id))})}>Drop</button>
                          </div>
                        ) : (
                          isEnrolled ? (
                            <button className="btn-secondary" style={{width: '100%'}} onClick={() => window.open(window.location.origin + '?courseViewer=' + course.id, '_blank')}>Access Materials In New Tab</button>
                          ) : (
                            <button className="btn-primary" style={{width: '100%'}} onClick={() => handleEnroll(course)}>Enroll Now</button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        );
      case 'My Enrollments':
        const myCourses = courses.filter(c => enrollments.includes(c.id));
        return (
          <div style={{animation: 'slide-up 0.4s ease-out'}}>
            <h1 className="page-title">My Learning Portal</h1>
            {myCourses.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-strong)'}}><button className="btn-primary" onClick={() => setActiveTab('Courses')}>Browse Catalog</button></div>
            ) : (
              <div className="course-grid">
                {myCourses.map(course => (
                  <div key={course.id} className="course-card" style={{padding: 0, overflow: 'hidden', borderLeft: '4px solid var(--accent-solid)'}}>
                    <div style={{height: '140px', width: '100%', backgroundImage: `url(${getCourseImage(course.title, course.category)})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
                    <div style={{padding: '25px'}}>
                      <h3>{course.title}</h3><p style={{marginTop: '10px'}}>{course.description}</p>
                      <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)'}}>
                        <button className="btn-secondary" style={{width: '100%'}} onClick={() => window.open(window.location.origin + '?courseViewer=' + course.id, '_blank')}>Resume Learning In New Tab</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default: return <div>Resource Not Found</div>;
    }
  };

  const menuItems = ['Home', 'Courses', 'My Enrollments', 'Mentorship & Solutions'];
  if (user?.role === 'TEACHER') menuItems.splice(3, 0, 'Instructor Hub');
  if (user?.role === 'ADMIN') menuItems.push('Admin Hub');

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo" style={{cursor: 'pointer'}} onClick={() => setActiveTab('Home')}>Learning.io</div>
        <nav className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Home'); }}>Platform</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Mentorship & Solutions'); }}>Mentorship & Solutions</a>
          {user && <span style={{color: 'var(--accent-solid)', padding: '4px 12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600'}}>{user.role} | {user.name}</span>}
          {user ? (
            <button className="btn-secondary" style={{padding: '8px 16px', color: '#fff', border: 'none'}} onClick={(e) => { e.preventDefault(); logout(); }}>Sign Out</button>
          ) : (
            <div style={{display: 'flex', gap: '15px'}}><button className="btn-secondary" style={{padding: '8px 16px', color: '#fff', border: 'none'}} onClick={(e) => { e.preventDefault(); setIsLoginMode(true); setActiveTab('Auth'); }}>Log In</button><button className="btn-primary" style={{padding: '8px 16px', color: '#fff', border: 'none'}} onClick={(e) => { e.preventDefault(); setIsLoginMode(false); setActiveTab('Auth'); }}>Sign Up</button></div>
          )}
        </nav>
      </header>

      {confirmModal.isOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999}}>
           <div className="course-card" style={{width: '450px', background: 'var(--bg-surface)', padding: '30px', animation: 'slide-up 0.2s ease-out'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '15px'}}>{confirmModal.title}</h2><p style={{color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6'}}>{confirmModal.message}</p>
              <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end'}}><button className="btn-secondary" onClick={() => setConfirmModal({isOpen: false})}>Cancel</button><button className={`btn-${confirmModal.type}`} onClick={() => { confirmModal.onConfirm(); setConfirmModal({isOpen: false}); }}>Confirm Overlay</button></div>
           </div>
        </div>
      )}

      <div className="main-layout">
        {user && (
          <aside className="sidebar">
            <ul className="sidebar-menu">
              {menuItems.map(item => <li key={item} className={activeTab === item ? 'active' : ''} onClick={() => setActiveTab(item)}>{item}</li>)}
            </ul>
          </aside>
        )}
        <main className="content-area" style={{margin: user ? '0' : '0 auto', maxWidth: user ? 'none' : '1400px', width: '100%'}}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
