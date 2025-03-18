import React, { useState } from "react";
import axios from "axios";
import "../style.css/ContactSupport.css";
import { useNavigate } from "react-router-dom";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    full_name: "",  // Updated field name
    email: "",
    user_message: "", // Updated field name
    attachment: null,
  });

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure this doesn't end with '/'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post(`${backendUrl}/Home/contact-support/`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Message sent successfully!");
      setFormData({ full_name: "", email: "", user_message: "", attachment: null });
      navigate("/");
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error.message);
      alert(`❌ Failed to send message: ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <div className="contact-support-container">
      <h2>Contact Support</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="Your Name" value={formData.full_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <textarea name="user_message" placeholder="Your Message" value={formData.user_message} onChange={handleChange} required />
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactSupport;
