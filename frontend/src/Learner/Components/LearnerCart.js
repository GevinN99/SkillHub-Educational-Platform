import React, {useEffect, useState} from "react";
import {Card, message, Spin} from "antd";
import courseBg from "../../assets/images/course-bg.png";
import { Link } from "react-router-dom";

const LearnerCart = () => {
    const [cartContents, setCartContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const learnerId = localStorage.getItem("learnerId");

    useEffect(() => {
        fetchCartContents();
    }, []);

    useEffect(() => {
        const total = cartContents.reduce((acc, cartItem) => acc + cartItem.price, 0);
        setTotalPrice(total);
    }, [cartContents]);

    const fetchCartContents = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8073/api/learner/cart/${learnerId}`,
                {
                    method: "GET"
                }
            );

            if (response.ok) {
                const data = await response.json();
                const flattenedCourses = data.reduce((acc, cartItem) => {
                    return acc.concat(cartItem.courses);
                }, []);
                setCartContents(flattenedCourses);
            } else {
                message.error("Failed to fetch cart contents");
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("An error occurred. Please try again.");
        }
        setLoading(false);
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
          fetchCartContents();
        } else {
          const data = await response.json();
          message.error(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("An error occurred. Please try again.");
      }
    };

    return (
        <div>
            <div className="row">
                <div className="col">
                    <h3>Shopping Cart</h3>
                </div>
            </div>
            {/* <div className="rounded-5 shadow-lg mt-3 mb-3" style={{height: '.5px', backgroundColor: '#6d6d6d'}}/> */}
            {/* <div className="row">
                <div className="col-2">
                    <h4>Courses in Chart</h4>
                </div>
            </div> */}
            <div className="rounded-5 shadow-lg mt-3 mb-3" style={{height: '.5px', backgroundColor: '#6d6d6d'}}/>
            <Spin spinning={loading}>
                {cartContents && cartContents.map((cartItem) => (
                    <div key={cartItem.courseId} style={{marginBottom: "20px"}}>
                        <Card className="rounded-5 shadow" style={{ width: "100%" }}>
                            <div className="row">
                                <div className="col-3">
                                    <img src={courseBg} alt="course" style={{ width: "50%" }} />
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <h5>{cartItem.title}</h5>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <div className="btn btn-outline-danger" onClick={() => handleRemoveFromCart(cartItem.courseId)}>
                                        Remove From Cart
                                    </div>
                                </div>
                                <div className="col-3 d-flex align-items-center justify-content-center">
                                    <h5>${cartItem.price}</h5>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
                <div className="position-absolut float-end mt-5 me-3 shadow-lg bg-light p-5 rounded-5 w-25">
                    <div className="fs-4">
                        <strong>Total:</strong> ${totalPrice}
                    </div>
                    <div className="btn btn-warning" style={{marginTop: '10px'}}>
                       <Link to="/payment">Checkout</Link> 
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default LearnerCart;
