import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification(props) {
    const notify = () => {
        toast.success(props.message,{
            theme:'dark',
            position:"bottom-right",
            
        });
        console.log(props.message)
    }

    return (
        <div>
            
            {/* ToastContainer must be rendered somewhere in the component tree */}
            <ToastContainer />
        </div>
    )
}

export default Notification;
