import React from 'react';
import AddUser from '../Functions/AddUser';
import GetUsers from '../Functions/GetUsers';

export default function Admin() {   
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4">Admin Page</h2>
            <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
                <AddUser />
                <GetUsers />
            </div>
        </div>
    );
}
