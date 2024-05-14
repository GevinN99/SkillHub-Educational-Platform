import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";
import { message } from "antd";
const SubmitTicketForm = () => {
  const storedLearnerId = localStorage.getItem("learnerId");
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    learnerId: storedLearnerId || "", // Ensure this defaults to empty string if not found
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearnerProfile = async () => {
      try {
        const response = await fetch("http://localhost:8073/api/learner/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          const data = await response.json();
          setLearnerProfile(data);
          console.log("Learner Profile:", data);
          // Update form data here when profile data is available
          setFormData(current => ({
            ...current,
            name: data.name,
            email: data.email
          }));
        } else {
          message.error("Failed to fetch learner profile");
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("An error occurred. Please try again.");
      }
    };
    fetchLearnerProfile();
  }, []); // Empty dependency array to only run once on component mount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final submission data", formData); // Debug log

    try {
      const response = await axios.post(
        "http://localhost:8074/api/tickets",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response from server:", response.data); // Debug log
      navigate("/learner/home");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border-solid"
      >
        <h1 className="mb-4 font-semibold text-lg">Support Portal</h1>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={learnerProfile?.name}
            onChange={handleChange}
            required
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={learnerProfile?.email}
            onChange={handleChange}
            required
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category:
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select category...</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Subject:
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message:
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Submit A Ticket
        </button>
      </form>
    </div>
  );
};

export default SubmitTicketForm;
