import React, { useState,useEffect } from 'react';
import CourseDetails from '../courseDetails/courseDetails';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import {Button, message} from "antd";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
function CheckoutForm() {
  const [enrollmentInfo, setEnrollmentInfo] = useState({
    learnerId: "",
    courseId: "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const learnerId = localStorage.getItem("learnerId");
  const [cartContents, setCartContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showNotification, setShowNotification] = useState(false); // State to control notification visibility

  const [selectedItem, setSelectedItem] = useState({
    name: "Learn Python: The Complete Python Programming Course",
    price: 99.99, // Example price
  });
  const submitPayment = () => {
    console.log("Processing payment", formData);
    setShowNotification(true); // Show notification when payment is processed
    setTimeout(() => setShowNotification(false), 3000); // Optionally hide after few seconds
  };

  useEffect(() => {
    fetchCartContents();
  }, []);

  useEffect(() => {
    const total = cartContents.reduce(
      (acc, cartItem) => acc + cartItem.price,
      0
    );
    setTotalPrice(total);
  }, [cartContents]);

  const fetchCartContents = async () => {
    setLoading(true); // Start loading state
    try {
      const response = await fetch(
        `http://localhost:8073/api/learner/cart/${learnerId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json(); // Extract JSON from the response
        // Useful place for a console log to debug or check data structure
        console.log("Fetched cart contents:", data);

        // Assuming data is an array of items where each item has a 'courses' array
        const flattenedCourses = data.reduce((acc, cartItem) => {
          return acc.concat(cartItem.courses); // Flatten all courses into a single array
        }, []);
        setCartContents(flattenedCourses); // Update state with the new cart contents
      } else {
        throw new Error("Failed to load the cart contents"); // Throw an error if response is not ok
      }
    } catch (error) {
      console.error("Error fetching cart contents:", error);
      message.error("An error occurred while fetching cart contents."); // Display error message to user
    }
    setLoading(false); // End loading state
  };
  // const EnrollToCourse = async () => {
  //   const token = localStorage.getItem('token');
  //   const courseId = cartContents.length > 0 ? cartContents[0]._id : null;
  //
  //   if (!courseId) {
  //     console.error("No course available to enroll.");
  //     return;
  //   }
  //
  //   try {
  //     const response = await fetch('http://localhost:8073/api/learner/enroll-course', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`  // Assuming Bearer token authentication
  //       },
  //       body: JSON.stringify({
  //         learnerId: learnerId,
  //         courseId: courseId,
  //       })
  //     });
  //
  //     if (!response.ok) {
  //       const message = `An error has occured: ${response.status}`;
  //       throw new Error(message);
  //     }
  //
  //     const responseData = await response.json();
  //     console.log('Enrollment Successful:', responseData);
  //
  //     // Update state with enrollment details
  //     setEnrollmentInfo({
  //       learnerId: learnerId,
  //       courseId: courseId
  //     });
  //
  //     return responseData;
  //
  //   } catch (error) {
  //     console.error('Enrollment Failed:', error);
  //     // Optionally handle errors (e.g., show a message to the user)
  //   }
  // };

  const EnrollToCourse = async (courseId) => {
    try {
      const response = await fetch(
        "http://localhost:8073/api/learner/enroll-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ learnerId, courseId }),
        }
      );

      if (response.ok) {
        message.success("Course enrolled successfully");
      } else {
        message.error("Failed to enroll in the course");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(), // Optionally trim spaces, or you can handle trimming in validation
    }));

    // Validate immediately on change
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };
  const validateField = (name, value) => {
    if (value === undefined || !value.trim()) return `${name} is required`;

    // Add specific validations per field
    switch (name) {
      case "cardNumber":
        const re = /^[0-9]{16}$/;
        if (!re.test(value)) return "Card number must be 16 digits.";
        break;
      case "expiryDate":
        const reExp = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        if (!reExp.test(value)) return "Expiry date must be in MM/YY format.";
        break;
      case "cvv":
        const reCvv = /^[0-9]{3,4}$/;
        if (!reCvv.test(value)) return "CVV must be 3 or 4 digits.";
        break;
      default:
        break;
    }
    return null;
  };

  const handleRemoveFromCart = async (courseId) => {
    try {
      const response = await fetch(
          `http://localhost:8073/api/learner/cart/${learnerId}/${courseId}`,
          {
            method: "DELETE",
          }
      );

      if (response.ok) {
        message.success("Course removed from cart successfully");
      } else {
        const data = await response.json();
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  const handlePayment = async (learnerId, cartContents) => {
    console.log("Processing payment", formData);
    toast.success("Payment is successful!", {
      theme: "dark",
      position: "bottom-right",
    });

    // Assuming `EnrollToCourse` can handle promises and multiple courses
    await Promise.all(
      cartContents.map((course) => EnrollToCourse(course.courseId))
    );
    await Promise.all(
      cartContents.map((course) =>
        handleRemoveFromCart(learnerId, course.courseId)
      )
    );

    setTimeout(() => {
      navigate("/learner/home"); // Navigate to home page after payment and operations
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateField();
    if (isValid) {
      const courseIds = cartContents.map((course) => course.courseId);
      await Promise.all(courseIds.map((courseId) => handleRemoveFromCart(courseId)));
      await Promise.all(courseIds.map((courseId) => EnrollToCourse(courseId)));
      navigate("/learner/home");
    } else {
      toast.error("Please correct the errors before submitting.", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  return (
    <div className="container py-8">
      <h2 className="text-primary mb-6">Checkout</h2>
      <CourseDetails />
      <form onSubmit={handleSubmit} className="row">
        <div className="col-lg-6 mb-4">
          <h3 className="text-secondary mb-4">Payment Details</h3>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className={`form-control mb-2 ${
              errors.fullName ? "is-invalid" : ""
            }`}
          />
          {errors.fullName && (
            <div className="invalid-feedback">{errors.fullName}</div>
          )}
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="Card Number"
            className={`form-control mb-2 ${
              errors.cardNumber ? "is-invalid" : ""
            }`}
          />
          {errors.cardNumber && (
            <div className="invalid-feedback">{errors.cardNumber}</div>
          )}
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="Expiry Date (MM/YY)"
            className={`form-control mb-2 ${
              errors.expiryDate ? "is-invalid" : ""
            }`}
          />
          {errors.expiryDate && (
            <div className="invalid-feedback">{errors.expiryDate}</div>
          )}
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="CVV"
            className={`form-control mb-2 ${errors.cvv ? "is-invalid" : ""}`}
          />
          {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}

          <div className="mt-4 p-4 bg-light shadow-sm rounded border border-primary">
            <p className="font-weight-bold">30-Day Money-Back Guarantee</p>
            <p>Full Lifetime Access</p>

            {/* Action Buttons */}
            <button className="btn btn-success mr-2 mt-2">Share</button>
            <button className="btn btn-primary mr-2 mt-2">
              Gift this course
            </button>
            <button className="btn btn-success mt-2">Apply the Coupon</button>

            <p className="mt-2">Training 5 or more people?</p>
            <p>
              Get your team access to 17,000+ top Udemy courses anytime,
              anywhere.
            </p>
            <button className="btn btn-link p-0">Try Udemy Business</button>
          </div>
        </div>

        <div className="col-lg-6">
          {cartContents.map((course, index) => (
            <div key={index} className="border p-4 rounded shadow-sm mb-4">
              <h3 className="text-secondary">{course.title}</h3>
              <p>Description: {course.description}</p>
              <p className="font-weight-bold">${course.price.toFixed(2)}</p>
            </div>
          ))}

          <div className="border p-4 rounded shadow-sm">
            <h3 className="text-secondary mb-2">Total Price</h3>
            <p className="font-weight-bold">${totalPrice}</p>
          </div>
          <button className="btn btn-primary mt-4 w-100" type="submit">
            Complete Purchase
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CheckoutForm;
