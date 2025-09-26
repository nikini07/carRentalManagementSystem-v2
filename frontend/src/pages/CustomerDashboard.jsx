// frontend/src/pages/CustomerDashboard.jsx
import React, { useState } from 'react';
import { Card, Table, Form } from '../components';
import { formatDate } from '../utils/formatDate';

const CustomerDashboard = ({ cars, bookings, onRefresh, api }) => {
  const [activeTab, setActiveTab] = useState('viewCars');
  const [customerId, setCustomerId] = useState('');

  const handleAction = async (type, data) => {
    try {
      await api.post(`/${type}`, data);
      onRefresh();
    } catch (error) {
      alert('Error: ' + error.response?.data?.detail || error.message);
    }
  };

  const renderTab = () => {
    const availableCars = cars.filter(c => c.available);
    switch (activeTab) {
      case 'register':
        return (
          <Card title="Register">
            <Form type="customer" onSubmit={(data) => handleAction('customers', data)} />
          </Card>
        );
      case 'book':
        return (
          <div>
            <Card title="Book a Car">
              <Form type="booking" onSubmit={(data) => handleAction('bookings', data)} customerId={customerId} />
            </Card>
            <Card title="Available Cars">
              <Table data={availableCars} columns={['id', 'brand', 'model', 'type', 'year', 'capacity', 'rate']} />
            </Card>
          </div>
        );
      case 'viewCars':
        return (
          <Card title="All Cars">
            <Table data={cars} columns={['id', 'brand', 'model', 'type', 'year', 'capacity', 'rate', 'available']} />
          </Card>
        );
      case 'myBookings':
        return (
          <Card title="My Bookings">
            <Table 
              data={bookings.filter(b => b.customerID === customerId).map(b => ({ ...b, startDate: formatDate(b.startDate), endDate: formatDate(b.endDate) }))}
              columns={['bookingID', 'carID', 'startDate', 'endDate']}
            />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {activeTab !== 'viewCars' && !customerId && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      )}
      <div className="flex space-x-4 mb-6">
        {['viewCars', 'register', 'book', 'myBookings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={['book', 'myBookings'].includes(tab) && !customerId}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-green-500 text-white' : 'bg-gray-200'} ${['book', 'myBookings'].includes(tab) && !customerId ? 'opacity-50' : ''}`}
          >
            {tab.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
};

export default CustomerDashboard;