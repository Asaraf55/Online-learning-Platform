import React, { useState } from 'react';

export default function Mentorship({ user, mentorshipRequests, setMentorshipRequests }) {
  const getNextDays = () => {
    const days = [];
    for(let i=0; i<4; i++) {
       const d = new Date();
       d.setDate(d.getDate() + i);
       days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    return days;
  };

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', date: getNextDays()[0], slot: 'Morning: 10:00 AM - 11:00 AM' });
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // If user is logged out, prompt login
  if (!user) {
    return (
      <div style={{animation: 'slide-up 0.4s ease-out', textAlign: 'center', padding: '60px 20px', maxWidth: '800px', margin: '0 auto'}}>
        <h1 className="page-title">Enterprise Mentorship & Support</h1>
        <p className="page-subtitle" style={{marginBottom: '30px'}}>Sign in heavily authenticating your identity before requesting a secure 1-on-1 global instructor allocation pipeline.</p>
        <button className="btn-primary" onClick={() => window.location.hash = "#auth"}>Authenticate Securely First</button>
      </div>
    );
  }

  const submitTarget = (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      setMsg({ type: 'error', text: 'Invalid Phone Number Formatted! Must contain exactly 10 raw digits.' });
      return;
    }

    const newRequest = {
      id: mentorshipRequests.length + 500,
      name: form.name,
      email: form.email,
      phone: form.phone,
      time: `${form.date} | ${form.slot}`,
      status: 'PENDING',
      link: null
    };
    
    setMentorshipRequests([...mentorshipRequests, newRequest]);
    setSubmitted(true);
  };

  const userRequests = mentorshipRequests.filter(r => r.email === user.email && r.status !== 'PENDING');

  return (
    <div style={{animation: 'slide-up 0.4s ease-out', maxWidth: '1000px', margin: '0 auto'}}>
       <h1 className="page-title">Interactive 1-on-1 Mentorship Allocations</h1>
       <p className="page-subtitle" style={{marginBottom: '40px'}}>Connect synchronously with our top Engineering System Administrators across customized Zoom layouts guaranteeing exponential growth.</p>
       
       <div style={{display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 1fr)', gap: '40px'}}>
          {/* Submission Form Block */}
          {!submitted ? (
            <form className="course-card" style={{padding: '35px'}} onSubmit={submitTarget}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '25px', color: '#fff'}}>Request Private Session Core</h2>
              
              {msg.text && (
                <div style={{ padding: '12px 15px', marginBottom: '20px', borderRadius: 'var(--radius-sm)', background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: msg.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
                  {msg.text}
                </div>
              )}

              <div className="form-group">
                <label>Registered Secure Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} disabled={user?.name} />
              </div>
              <div className="form-group">
                <label>Linked Profile Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={user?.email} />
              </div>
              <div className="form-group">
                <label>Contact Phone Number</label>
                <input required placeholder="+1 555-0192" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Allocation Date</label>
                  <select value={form.date} onChange={e => setForm({...form, date: e.target.value})}>
                     {getNextDays().map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Exact Capacity Slot</label>
                  <select value={form.slot} onChange={e => setForm({...form, slot: e.target.value})}>
                     <option>Morning: 10:00 AM - 11:00 AM</option>
                     <option>Afternoon: 1:00 PM - 2:00 PM</option>
                     <option>Evening: 5:00 PM - 6:00 PM</option>
                     <option>Night: 9:00 PM - 10:00 PM</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '20px', padding: '14px', fontSize: '1.05rem'}}>Queue Deployment Ping</button>
            </form>
          ) : (
             <div className="course-card" style={{padding: '40px', textAlign: 'center', borderColor: 'var(--success)'}}>
                <div style={{fontSize: '3rem', marginBottom: '20px'}}>✅</div>
                <h2 style={{color: '#fff', marginBottom: '15px'}}>Successfully Pinged Admins!</h2>
                <p style={{color: 'var(--text-secondary)'}}>Your mentorship request was securely captured. Please monitor your status natively below.</p>
                <button className="btn-secondary" style={{marginTop: '30px'}} onClick={() => setSubmitted(false)}>Queue Another Session</button>
             </div>
          )}
          
          {/* Status Display Block */}
          <div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '25px', color: '#fff', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>Active Mentorship Pipelines</h2>
            {userRequests.length === 0 ? (
               <p style={{color: 'var(--text-muted)'}}>No active requests found assigned to your registry credentials.</p>
            ) : (
               userRequests.map(req => (
                 <div key={req.id} style={{background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '15px', borderLeft: req.status === 'PENDING' ? '4px solid var(--warning)' : '4px solid var(--success)'}}>
                   <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <h4 style={{color: '#fff', margin: 0}}>{req.time} Session</h4>
                      <span className={req.status === 'PENDING' ? 'badge badge-pending' : 'badge badge-approved'}>{req.status}</span>
                   </div>
                   {req.status === 'ALLOCATED' && (
                     <div style={{marginTop: '15px'}}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px'}}>Assigned Meeting Hyperlink Protocol:</p>
                        <a href={req.link} target="_blank" rel="noreferrer" className="btn-primary" style={{display: 'inline-block', width: '100%', textAlign: 'center', textDecoration: 'none'}}>Enter Secured Zoom Room</a>
                     </div>
                   )}
                 </div>
               ))
            )}
            
            <div style={{marginTop: '40px', padding: '25px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
               <h3 style={{color: 'var(--accent-solid)', marginBottom: '10px', fontSize: '1.1rem'}}>Technical Support Protocol</h3>
               <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>For immediate catastrophic system support rather than mentoring configurations, please relay SMTP traces toward <span style={{color: '#fff'}}>ashrafr53216@gmail.com</span>.</p>
            </div>
          </div>
       </div>
    </div>
  );
}
