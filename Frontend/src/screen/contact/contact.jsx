import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Youtube, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Send, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', product: '', message: '' });
    }, 3000);
  };

  const socialLinks = [
    { 
      name: 'YouTube', 
      icon: <Youtube size={24} />, 
      link: 'https://www.youtube.com/@finebearingandoilsealstore', 
      color: '#FF0000',
      description: 'Technical Tutorials & Product Reviews'
    },
    { 
      name: 'Instagram', 
      icon: <Instagram size={24} />, 
      link: 'https://www.instagram.com/finebearing/', 
      color: '#E1306C',
      description: 'Daily Updates & Behind the Scenes'
    },
    { 
      name: 'Facebook', 
      icon: <Facebook size={24} />, 
      link: 'https://www.facebook.com/finebearing', 
      color: '#1877F2',
      description: 'Industry News & Community'
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={24} />, 
      link: 'https://www.linkedin.com/company/fine-bearing-oil-seal-store/', 
      color: '#0A66C2',
      description: 'Professional B2B Network'
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle size={24} />, 
      link: 'https://wa.me/918146119761', 
      color: '#25D366',
      description: 'Quick Enquiries & Support'
    }
  ];

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <div className="hero-badge">Industrial Solutions Since 1998</div>
          <h1>Get in Touch with Our Experts</h1>
          <p>Partner with India's leading industrial bearing specialists. Whether you need a technical quote or custom industrial solutions, our team is ready to assist.</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-info-column">
            <div className="info-card main-details">
              <h2>Fine Bearing & Oil Seal Store</h2>
              <span className="subtitle">Authorized Industrial Distributors</span>
              
              <div className="detail-item">
                <div className="icon-box"><MapPin size={24} /></div>
                <div>
                  <h3>Our Location</h3>
                  <p>Shere Punjab Building, Link Road,<br />Opposite Industrial Estate, Near Dholewal Bridge,<br />Ludhiana - 141003, Punjab, India</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="icon-box"><Phone size={24} /></div>
                <div>
                  <h3>Call / WhatsApp</h3>
                  <p>+91 8146119761</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="icon-box"><Mail size={24} /></div>
                <div>
                  <h3>Email Address</h3>
                  <p>sales@finebearings.com</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="icon-box"><Clock size={24} /></div>
                <div>
                  <h3>Business Hours</h3>
                  <p>Mon - Sat: 10:00 AM - 7:30 PM</p>
                </div>
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Our Journey</h3>
              <p>Stay updated with the latest industrial technology and product launches.</p>
              <div className="social-cards">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-card"
                    style={{ '--hover-color': social.color }}
                  >
                    <div className="social-icon">{social.icon}</div>
                    <div className="social-text">
                      <h4>{social.name}</h4>
                      <p>{social.description}</p>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-column">
            <div className="enquiry-card">
              <div className="card-badge"><ShieldCheck size={16} /> Secure B2B Enquiry</div>
              <h2>Send an Enquiry</h2>
              <p>Fill out the form below and our technical team will get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                </div>

                <div className="form-group">
                  <label>Contact Details</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Interested In</label>
                  <input type="text" name="product" value={formData.product} onChange={handleChange} placeholder="e.g. SKF 6205 Bearing, Oil Seals" />
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Describe your requirement in detail..." rows="5" required></textarea>
                </div>

                <button type="submit" className={`submit-btn ${submitted ? 'success' : ''}`}>
                  {submitted ? 'Enquiry Sent Successfully!' : <>Send Message <Send size={20} /></>}
                </button>
              </form>

              <div className="whatsapp-fast-track">
                <p>Need a faster response for urgent orders?</p>
                <a href="https://wa.me/918146119761" target="_blank" rel="noopener noreferrer" className="wa-btn">
                  <MessageCircle size={22} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <section className="youtube-section">
          <div className="section-header">
            <h2>Latest From Our YouTube Channel</h2>
            <p>Expert insights, product comparisons, and maintenance tips for industrial components.</p>
          </div>
          <div className="video-container">
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/videoseries?list=UUv-mN0B0VvGvN0B0VvGvN0B" title="Industrial Insights" frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="yt-cta">
            <a href="https://www.youtube.com/@finebearingandoilsealstore" target="_blank" className="btn-yt">
              <Youtube size={22} /> Subscribe for More
            </a>
          </div>
        </section>

        <section className="maps-section">
          <div className="section-header">
            <h2>Visit Our Store</h2>
            <p>Located in the heart of Ludhiana's industrial hub.</p>
          </div>
          <div className="map-wrapper">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3423.8!2d75.8!3d30.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDUzJzMzLjYiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000" width="100%" height="500" style={{ border: 0 }} allowFullScreen></iframe>
            <div className="map-info">
              <div className="info-badge"><ExternalLink size={14} /> <a href="https://maps.google.com" target="_blank">Open Maps</a></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
