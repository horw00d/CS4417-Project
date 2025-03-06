import React from 'react';
import AddUser from '../Functions/AddUser';
import GetUsers from '../Functions/GetUsers';

export default function Admin() {   
    return (
        <div>
            <h2>Admin Page</h2>
            <GetUsers/>
            <AddUser/>
        </div>
    );
}
