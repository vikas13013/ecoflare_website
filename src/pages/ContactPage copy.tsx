import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bannerImg from "../assets/slider-images/Contact.jpg";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      subject: "",
      message: ""
    };

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      // Show loading state
      const toastId = toast.loading("Sending your message...", {
        position: "top-right"
      });

      // API call to your backend
      const response = await fetch('http://147.182.150.180:12002/account/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Update toast to success
      toast.update(toastId, {
        render: "Your message has been sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setFormData({
        subject: "",
        message: ""
      });

    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] w-full flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImg}
            alt="Contact Background"
            className="w-full h-full object-cover [object-position:60%_20%]"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-right md:mt-36">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Contact</h1>
          <div className="text-white text-sm md:text-base flex justify-center items-center gap-2">
            <Link to="/" className="hover:underline">Home</Link>
            <span>›</span>
            <span className="font-semibold">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side - Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-md w-full">
              <h2 className="text-3xl font-bold text-green-800 mb-6">Let's Connect!</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Subject */}
                <div>
                  <label className="block font-semibold text-green-900 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full border ${errors.subject ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block font-semibold text-green-900 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 resize-none`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Link to="/register"
                  
                  className="px-6 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
                >
                  Submit
                </Link>
                {/* <button
                  type="submit"
                  className="px-6 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
                >
                  Submit
                </button> */}
              </form>
            </div>

            {/* Right Side - Contact Info */}
            <div className="space-y-10 pt-2">
              <h2 className="text-3xl font-bold text-green-800">Reach out to us!</h2>

              <div>
                <p className="text-lg text-gray-700 font-medium">
                  <span className="text-green-900 font-semibold">E-mail :</span>{" "}
                  info@ecoflaresolutions.com
                </p>
              </div>

              <div>
                <p className="text-lg text-gray-700 font-medium">
                  <span className="text-green-900 font-semibold">Socials:</span>
                </p>
                <div className="flex gap-5 mt-4">
                  {[
                    { icon: <FaFacebookF size={20} />, url: "https://www.facebook.com/ecoflareinc" },
                    { icon: <FaInstagram size={20} />, url: "https://www.instagram.com/ecoflareinc/" },
                    { icon: <FaLinkedinIn size={20} />, url: "https://www.linkedin.com/company/ecoflare-solutions-inc/" },
                    { icon: <FaXTwitter size={20} />, url: "https://x.com/EcoflareInc" },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-800 border border-green-300 hover:bg-green-700 hover:text-white transition-all duration-300 shadow-sm"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;