import React, { useState, useEffect } from 'react';
import { Users, Search, Percent, Save, User as UserIcon, Building2, Phone, Calendar } from 'lucide-react';
import { getAuthToken, isAdmin } from '../../utils/auth';
import './user-management.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  
  const token = getAuthToken();
  const isAdminUser = isAdmin();

  useEffect(() => {
    if (!isAdminUser) {
      window.location.href = '/login';
      return;
    }
    fetchUsers();
  }, [isAdminUser]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);
      setError("Network error. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiscount = async (userId, discount) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/discount`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ specialDiscount: discount })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        // Also update local storage if it's the current user (though unlikely for admin to discount themselves here)
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem('user', JSON.stringify({ ...currentUser, specialDiscount: discount }));
        }
      } else {
        alert("Failed to update discount");
      }
    } catch (error) {
      console.error("Update Discount Error:", error);
      alert("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateGst = async (userId, gst) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/gst`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gstNumber: gst })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
      } else {
        alert("Failed to update GST");
      }
    } catch (error) {
      console.error("Update GST Error:", error);
      alert("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading customer accounts...</p>
    </div>
  );

  return (
    <div className="user-management-screen">
      <div className="container">
        <header className="mgmt-header">
          <div className="header-info">
            <h1>Customer Discounts</h1>
            <p>Manage special percentage-off discounts for specific B2B customers.</p>
          </div>
          <div className="mgmt-stats">
            <div className="stat-card">
              <Users size={20} />
              <div className="stat-info">
                <span>Total Customers</span>
                <strong>{users.length}</strong>
              </div>
            </div>
          </div>
        </header>

        <div className="mgmt-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" onClick={fetchUsers}>Refresh List</button>
        </div>

        {error && <div className="mgmt-error-alert">{error}</div>}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Customer Details</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Registered</th>
                <th>GST Number</th>
                <th>Special Discount</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-id">ID: {user.id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="company-cell">
                      <Building2 size={14} />
                      <span>{user.company || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <Phone size={14} />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <div className="gst-input-group">
                       <input 
                          type="text" 
                          placeholder="Add GSTIN"
                          className="mgmt-gst-input"
                          defaultValue={user.gstNumber || ''}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val !== (user.gstNumber || '')) {
                              handleUpdateGst(user.id, val);
                            }
                          }}
                          disabled={updatingId === user.id}
                        />
                    </div>
                  </td>
                  <td>
                    <div className="discount-input-group">
                      <div className="input-wrapper">
                        <input 
                          type="number" 
                          min="0" 
                          max="100"
                          defaultValue={user.specialDiscount || 0}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val !== (user.specialDiscount || 0)) {
                              handleUpdateDiscount(user.id, val);
                            }
                          }}
                          disabled={updatingId === user.id}
                        />
                        <Percent size={14} className="percent-icon" />
                      </div>
                      {updatingId === user.id && <div className="mini-loader"></div>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && !loading && (
            <div className="empty-state">
              <Users size={48} />
              <h3>No customers found</h3>
              <p>Try a different search term or wait for new registrations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
