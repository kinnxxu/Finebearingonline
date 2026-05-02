import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building, Shield, LogOut, Save, ArrowLeft } from 'lucide-react';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const authStatus = localStorage.getItem('isAdminAuthenticated');

    if (!userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
    setIsAdmin(authStatus === 'true');
    
    setName(user.displayName || user.username || '');
    setEmail(user.email || '');
    setCompany(user.company || '');
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const updatedUser = { ...currentUser, displayName: name, company };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="profile-screen">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {name ? name.charAt(0).toUpperCase() : <User size={40} />}
          </div>
          <div className="profile-title">
            <h2>{name || 'Account Settings'}</h2>
            <p>{email}</p>
          </div>
          <button className="icon-btn" onClick={() => navigate('/')}><ArrowLeft size={24} /></button>
        </div>

        <div className="profile-content">
          <form onSubmit={handleUpdateProfile}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email (read-only)</label>
                <input value={email} disabled />
              </div>
            </div>
            <div className="form-section">
              <h3>Business Details</h3>
              <div className="form-group">
                <label>Company Name</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            {successMsg && <div className="success-alert">{successMsg}</div>}
            <div className="profile-actions">
              <button type="button" className="btn btn-logout" onClick={handleLogout}><LogOut size={18} /> Logout</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : <><Save size={18} /> Save</>}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
