import React from 'react';
import Logout from '../Authentication/Logout';
import AddFeedback from '../Functions/AddFeedback';
import GetFeedback from '../Functions/GetFeedback';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4">Landing Page</h2>
            <div className="max-w-2xl w-full">
                {/* Top row buttons */}
                <div className="flex justify-between items-center mb-4">
                    <div className="space-x-4">
                        <Link 
                            to="/changePassword" 
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                        >
                            Change Password
                        </Link>
                        <Link 
                            to="/admin" 
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                        >
                            Admin Page
                        </Link>
                    </div>
                    <Logout />
                </div>
                <GetFeedback />
                <AddFeedback />
            </div>
        </div>
    );
}
