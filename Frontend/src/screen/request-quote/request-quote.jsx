import React, { useState } from 'react';
import { Send, FileText, Package, CheckCircle } from 'lucide-react';
import './request-quote.css';

const RequestQuote = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    quantity: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="quote-success-screen">
        <div className="container">
          <div className="success-card">
            <CheckCircle size={80} color="#10b981" />
            <h1>Quote Request Received!</h1>
            <p>Our B2B sales team will get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-screen">
      <div className="container">
        <div className="quote-container">
          <div className="quote-info">
            <h1>Request a Bulk Quote</h1>
            <p>Get customized pricing for large volume orders.</p>
            <div className="benefit-item">
              <Package size={24} />
              <div>
                <h4>Wholesale Pricing</h4>
                <p>Significant discounts on bulk purchases.</p>
              </div>
            </div>
          </div>

          <div className="quote-form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input name="company" value={formData.company} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Business Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary submit-btn">
                Send Request <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestQuote;
