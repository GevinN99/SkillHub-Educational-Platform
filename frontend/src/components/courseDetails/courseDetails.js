// CourseDetails.js
import React from 'react';

function CourseDetails() {
    return (
        <div className="bg-blue-50 shadow-lg rounded-lg p-6 mb-6 border border-blue-200 p-3 rounded-5 mb-5">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">What You'll Learn</h3>
            <ul className="list-disc pl-5 space-y-3">
                <li>Create their own Python Programs</li>
                <li>Become an experienced Python Programmer</li>
                <li>Parse the Web and Create their own Games</li>
            </ul>
        </div>
    );
}

export default CourseDetails;
