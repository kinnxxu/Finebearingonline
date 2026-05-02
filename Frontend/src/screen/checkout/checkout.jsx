import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';
import { resolveImageUrl } from '../../components/home/ProductCard';
import { MapPin, ShoppingBag, CreditCard, CheckCircle, ChevronRight, User, Phone, Mail, Building, ArrowLeft, Search, Loader2 } from 'lucide-react';
import './checkout.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity } = useSelector((state) => state.cart);
  const dropdownRef = useRef(null);
  
  const userData = JSON.parse(localStorage.getItem('user')) || null;
  const specialDiscount = userData?.specialDiscount || 0;
  
  const [step, setStep] = useState(1);
  const [addressSearch, setAddressSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [addressData, setAddressData] = useState({
    fullName: userData?.name || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
    company: userData?.company || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    lat: '',
    lng: '',
    landmark: '',
    nearbyPlaces: '',
    gstNumber: userData?.gstNumber || '',
    deliveryInstructions: ''
  });

  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '';

  // Debounced Search Effect
  useEffect(() => {
    if (addressSearch.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(() => fetchSuggestions(addressSearch), 400);
    return () => clearTimeout(timer);
  }, [addressSearch]);

  // Click Outside logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (text) => {
    if (!GEOAPIFY_KEY) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&filter=countrycode:in&limit=5&apiKey=${GEOAPIFY_KEY}`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Geoapify Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestion = (feature) => {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    setAddressData(prev => ({
      ...prev,
      street: props.formatted,
      city: props.city || props.municipality || '',
      state: props.state || '',
      zip: props.postcode || '',
      country: props.country || 'India',
      lat: lat,
      lng: lng
    }));

    setAddressSearch(props.formatted);
    setShowDropdown(false);
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_KEY}`);
          const data = await res.json();
          if (data.features?.length > 0) selectSuggestion(data.features[0]);
        } catch (err) {
          console.error("Reverse geocode error", err);
        }
      });
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = (subtotal * specialDiscount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * 0.18;
  const totalPrice = taxableAmount + gstAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // --- SECURE PAYMENT FLOW ---
  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create order on backend (Backend calculates total from DB)
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: items.map(i => ({ id: i.id, quantity: i.quantity })), // Only send ID and quantity
          userId: userData?.id || userData?.phone, 
          shippingAddress: addressData 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Order creation failed');
      }

      const orderData = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fine Bearing & Oil Seal",
        description: "Secure B2B Purchase",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }),
            });

            if (verifyRes.ok) {
              const result = await verifyRes.json();
              dispatch(clearCart());
              navigate('/order-success', { state: { order: result.order } });
            } else {
              const error = await verifyRes.json();
              navigate('/order-failure', { state: { message: error.message } });
            }
          } catch (err) {
            console.error("Verification Error:", err);
            navigate('/order-failure');
          }
        },
        prefill: {
          name: addressData.fullName,
          email: addressData.email,
          contact: addressData.phone
        },
        theme: { color: "#ea580c" },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        navigate('/order-failure', { state: { message: response.error.description } });
      });
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) return <div className="checkout-empty-state"><h2>Empty Cart</h2><button onClick={() => navigate('/products')}>Shop</button></div>;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}><div className="step-icon"><MapPin size={18} /></div><span>Shipping</span></div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}><div className="step-icon"><CheckCircle size={18} /></div><span>Review</span></div>
          <div className="progress-line"></div>
          <div className="progress-step"><div className="step-icon"><CreditCard size={18} /></div><span>Payment</span></div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {step === 1 ? (
              <div className="checkout-card">
                <div className="card-header">
                  <div className="header-flex">
                    <div>
                      <h3><MapPin size={20} /> Shipping Address</h3>
                      <p>Enter your details and address for fast delivery.</p>
                    </div>
                    <button type="button" onClick={handleLocateMe} className="locate-btn">
                      <MapPin size={14} /> Detect My Location
                    </button>
                  </div>
                </div>

                <div className="map-search-container" ref={dropdownRef}>
                  <div className="search-suggest-box">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Start typing your full address..." 
                      value={addressSearch}
                      onChange={(e) => setAddressSearch(e.target.value)}
                      onFocus={() => addressSearch.length >= 3 && setShowDropdown(true)}
                    />
                    {isLoading && <Loader2 className="search-loader animate-spin" size={18} />}
                  </div>
                  
                  {showDropdown && (
                    <div className="suggestions-list">
                      {suggestions.length > 0 ? (
                        suggestions.map((feature, index) => (
                          <div key={index} className="suggestion-item" onClick={() => selectSuggestion(feature)}>
                            <MapPin size={14} />
                            <span>{feature.properties.formatted}</span>
                          </div>
                        ))
                      ) : (
                        !isLoading && <div className="no-results">No address found for "{addressSearch}"</div>
                      )}
                    </div>
                  )}
                </div>

                <form className="address-form" onSubmit={handleNextStep}>
                  <div className="form-grid">
                    <div className="form-group full"><label><User size={14} /> Full Name *</label><input required name="fullName" value={addressData.fullName} onChange={handleInputChange} /></div>
                    <div className="form-group"><label><Phone size={14} /> Phone *</label><input required name="phone" value={addressData.phone} onChange={handleInputChange} /></div>
                    <div className="form-group"><label><Mail size={14} /> Email *</label><input required type="email" name="email" value={addressData.email} onChange={handleInputChange} /></div>
                    
                    <div className="form-group full"><label>Street Address / Full Address *</label>
                      <textarea required name="street" value={addressData.street} onChange={handleInputChange} rows="2" />
                    </div>

                    <div className="form-group"><label>City *</label><input required name="city" value={addressData.city} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>State *</label><input required name="state" value={addressData.state} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>ZIP Code *</label><input required name="zip" value={addressData.zip} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Country</label><input disabled name="country" value={addressData.country} /></div>
                    <div className="form-group full"><label>GST Number (Optional)</label><input name="gstNumber" placeholder="22AAAAA0000A1Z5" value={addressData.gstNumber} onChange={handleInputChange} /></div>

                    <div className="form-group full"><label>Landmark & Delivery Instructions *</label>
                      <textarea required name="nearbyPlaces" value={addressData.nearbyPlaces} onChange={handleInputChange} placeholder="e.g. Near Metro Pillar 12, Leave at gate" rows="2" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary continue-btn">Continue to Review <ChevronRight size={18} /></button>
                </form>
              </div>
            ) : (
              <div className="checkout-card">
                <div className="card-header"><h3><CheckCircle size={20} /> Order Review</h3></div>
                <div className="review-section">
                  <div className="review-address-box">
                    <strong>{addressData.fullName}</strong>
                    <p>{addressData.street}</p>
                    <p>{addressData.city}, {addressData.state} - {addressData.zip}</p>
                    <p className="contact-info">Phone: {addressData.phone}</p>
                    {addressData.gstNumber && <p className="contact-info">GSTIN: {addressData.gstNumber}</p>}
                  </div>
                </div>
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="btn-outline back-btn"><ArrowLeft size={18} /> Back</button>
                  <button onClick={handlePayment} className="btn-primary pay-btn">Pay ₹{totalPrice.toFixed(2)}</button>
                </div>
              </div>
            )}
          </div>

          <aside className="checkout-sidebar">
            <div className="order-summary-card">
              <h3>Summary</h3>
              <div className="summary-row"><span>Items</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && (
                <div className="summary-row discount"><span>Special Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>
              )}
              <div className="summary-row"><span>Taxable Value</span><span>₹{taxableAmount.toFixed(2)}</span></div>
              <div className="summary-row"><span>GST (18%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
              <div className="summary-total"><span>Total Payable</span><span className="amount">₹{totalPrice.toFixed(2)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
