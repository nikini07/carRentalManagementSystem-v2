// frontend/src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { Card, Table, Form, Chart, InvoicePDF } from '../components';
import { formatDate } from '../utils/formatDate';

const AdminDashboard = ({ cars, customers, bookings, invoices, onRefresh, api }) => {
  const [activeTab, setActiveTab] = useState('cars');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleAction = async (type, data) => {
    try {
      await api.post(`/${type}`, data);
      onRefresh();
    } catch (error) {
      alert('Error: ' + error.response?.data?.detail || error.message);
    }
  };

  const handleUpdate = async (type, body) => {
    try {
      await api.post(`/update${type.charAt(0).toUpperCase() + type.slice(1)}`, body);
      onRefresh();
    } catch (error) {
      alert('Error: ' + error.response?.data?.detail || error.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (confirm(`Delete ${type}?`)) {
      try {
        await api.post(`/delete${type.charAt(0).toUpperCase() + type.slice(1)}`, { id });
        onRefresh();
      } catch (error) {
        alert('Error: ' + error.response?.data?.detail || error.message);
      }
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'cars':
        return (
          <div>
            <Card title="Cars Management">
              <Form type="car" onSubmit={(data) => handleAction('cars', data)} />
              <Table
                data={cars}
                columns={['id', 'brand', 'model', 'type', 'year', 'capacity', 'rate', 'available']}
                onUpdate={handleUpdate.bind(null, 'car')}
                onDelete={handleDelete.bind(null, 'car')}
              />
            </Card>
          </div>
        );
      case 'customers':
        return (
          <div>
            <Card title="Customers Management">
              <Form type="customer" onSubmit={(data) => handleAction('customers', data)} />
              <Table
                data={customers}
                columns={['id', 'name', 'license', 'contact']}
                onUpdate={handleUpdate.bind(null, 'customer')}
                onDelete={handleDelete.bind(null, 'customer')}
              />
            </Card>
          </div>
        );
      case 'bookings':
        return (
          <div>
            <Card title="Bookings Management">
              <Form type="booking" onSubmit={(data) => handleAction('bookings', data)} />
              <Table
                data={bookings.map(b => ({ ...b, startDate: formatDate(b.startDate), endDate: formatDate(b.endDate) }))}
                columns={['bookingID', 'carID', 'customerID', 'startDate', 'endDate']}
                onUpdate={handleUpdate.bind(null, 'booking')}
                onDelete={handleDelete.bind(null, 'booking')}
              />
            </Card>
          </div>
        );
      case 'invoices':
        return (
          <div>
            <Card title="Invoices">
              <Table
                data={invoices}
                columns={['invoiceID', 'bookingID', 'amount', 'date']}
              />
              {selectedInvoice && (
                <InvoicePDF invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
              )}
            </Card>
          </div>
        );
      case 'stats':
        return (
          <Card title="Statistics">
            <Chart type="bar" data={bookings.map(b => ({ month: b.startDate.month, count: 1 }))} />
            <Chart type="pie" data={cars.map(c => ({ type: c.type, value: c.rate }))} />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-6">
        {['cars', 'customers', 'bookings', 'invoices', 'stats'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
};

export default AdminDashboard;