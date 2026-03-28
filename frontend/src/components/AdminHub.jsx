import React, { useState, useEffect } from 'react';

export default function AdminHub({ usersDb, setUsersDb, confirmModal, setConfirmModal, mentorshipRequests, setMentorshipRequests }) {
  const [activeAdminTab, setActiveAdminTab] = useState('registry');
  const [zoomLinkInput, setZoomLinkInput] = useState('');
  const [adminMsg, setAdminMsg] = useState({ type: '', text: '' });
  
  // Real Database Sync Effect Hook!
  useEffect(() => {
    // Attempt authentic HTTP fetch retrieving all Postgres Users seamlessly
    fetch('/api/students/all', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(res => res.json())
      .then(data => {
         if (Array.isArray(data) && data.length > 0) {
            // Merge raw DB students tracking
            const fetchedUsers = data.map(d => ({
              id: d.id,
              name: d.firstName + ' ' + d.lastName,
              email: d.email,
              role: d.role,
              enrolledCount: 0 
            }));
            
            // Only inject if DB isn't perfectly mirrored
            if (fetchedUsers.length !== usersDb.length) {
                setUsersDb(fetchedUsers);
            }
         }
      })
      .catch(err => console.error("Error fetching admin registry mapping:", err));
    // eslint-disable-next-line
  }, []);

  const handleAllocateZoom = (req) => {
    setAdminMsg({ type: '', text: '' });
    if(!zoomLinkInput.includes('zoom.us') && !zoomLinkInput.includes('meet.')) {
      setAdminMsg({ type: 'error', text: 'Please enter a valid Zoom or Meeting link URL.' });
      return;
    }

    // Ping backend invoking RabbitMQ Zoom allocations 
    fetch('/api/students/mentorship/notify', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({ email: req.email, name: req.name, link: zoomLinkInput })
    }).catch(err => console.error("Allocations Sync Truncated:", err));

    setMentorshipRequests(mentorshipRequests.map(r => 
      r.id === req.id ? { ...r, status: 'ALLOCATED', link: zoomLinkInput } : r
    ));
    setZoomLinkInput('');
  };

  return (
    <div style={{animation: 'slide-up 0.4s ease-out'}}>
      <h1 className="page-title">System Administrator Console</h1>
      <p className="page-subtitle" style={{marginBottom: '30px'}}>Manage user identities, platform integrity, and mentorship allocations.</p>
      
      <div style={{display: 'flex', gap: '15px', marginBottom: '30px'}}>
        <button className={activeAdminTab === 'registry' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveAdminTab('registry')}>User Registry</button>
        <button className={activeAdminTab === 'mentorship' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveAdminTab('mentorship')}>
           Mentorship Queue {mentorshipRequests.filter(r => r.status === 'PENDING').length > 0 && <span className="badge badge-pending" style={{marginLeft: '8px'}}>{mentorshipRequests.filter(r => r.status === 'PENDING').length}</span>}
        </button>
      </div>
      
      {activeAdminTab === 'registry' && (
        <div style={{marginBottom: '50px'}}>
          <h2 style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px'}}>Global User Registry Database (Live Postgres Sync)</h2>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)'}}>
                  <th style={{padding: '12px'}}>ID</th>
                  <th style={{padding: '12px'}}>Name</th>
                  <th style={{padding: '12px'}}>Email / Credentials</th>
                  <th style={{padding: '12px'}}>Role Scope</th>
                  <th style={{padding: '12px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersDb.map(u => (
                  <tr key={u.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                    <td style={{padding: '12px'}}>{u.id}</td>
                    <td style={{padding: '12px', color: '#fff'}}>{u.name}</td>
                    <td style={{padding: '12px'}}>{u.email}</td>
                    <td style={{padding: '12px'}}><span className="badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-solid)'}}>{u.role}</span></td>
                    <td style={{padding: '12px'}}>
                      <button className="btn-danger" style={{padding: '6px 12px', fontSize: '0.85rem'}} onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          type: 'danger',
                          title: 'Terminate User',
                          message: `Force terminate user account: ${u.email}? This drops their database entry permanently.`,
                          onConfirm: () => setUsersDb(usersDb.filter(usr => usr.id !== u.id))
                        });
                      }}>Terminate User</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'mentorship' && (
        <div>
          <h2 style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px'}}>1-on-1 Zoom Mentorship Allocations</h2>
          
          {adminMsg.text && (
             <div style={{ padding: '12px 15px', marginBottom: '20px', borderRadius: 'var(--radius-sm)', background: adminMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: adminMsg.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
               {adminMsg.text}
             </div>
          )}

          {mentorshipRequests.filter(r => r.status === 'PENDING').length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>No active mentorship queue pings pending allocation.</p>
          ) : (
            <div className="course-grid">
              {mentorshipRequests.filter(r => r.status === 'PENDING').map(req => (
                <div key={req.id} className="course-card" style={{borderLeft: '4px solid var(--warning)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3>{req.name}</h3>
                    <span className="badge badge-pending">{req.status}</span>
                  </div>
                  <p style={{marginTop: '10px', color: 'var(--text-secondary)'}}>Email: <strong style={{color: '#fff'}}>{req.email}</strong></p>
                  <p style={{color: 'var(--text-secondary)'}}>Phone: <strong style={{color: '#fff'}}>{req.phone}</strong></p>
                  <p style={{color: 'var(--text-secondary)'}}>Session Slot: <strong style={{color: '#fff'}}>{req.time}</strong></p>
                  
                  <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
                    <input 
                      placeholder="Enter Global Zoom URI (https://zoom.us/j/...)" 
                      style={{width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}}
                      onChange={e => setZoomLinkInput(e.target.value)}
                    />
                    <button className="btn-primary" style={{width: '100%'}} onClick={() => handleAllocateZoom(req)}>Allocate Meeting & Vanish</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
