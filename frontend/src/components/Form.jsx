// frontend/src/components/Form.jsx
import React, { useState } from 'react';
import { DatePicker } from 'antd'; // Assume Ant Design for date picker; install if needed

const Form = ({ type, onSubmit, customerId }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target ? e.target.value : e });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'booking' && customerId) {
      formData.customerID = customerId;
    }
    onSubmit(formData);
  };

  const fields = {
    car: [
      { name: 'id', type: 'text', label: 'ID' },
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'model', type: 'text', label: 'Model' },
      { name: 'type', type: 'text', label: 'Type' },
      { name: 'year', type: 'number', label: 'Year' },
      { name: 'capacity', type: 'number', label: 'Capacity' },
      { name: 'rate', type: 'number', label: 'Rate' },
    ],
    customer: [
      { name: 'name', type: 'text', label: 'Name' },
      { name: 'license', type: 'text', label: 'License' },
      { name: 'contact', type: 'text', label: 'Contact' },
    ],
    booking: [
      { name: 'carID', type: 'text', label: 'Car ID' },
      { name: 'startDate', type: 'date', label: 'Start Date' },
      { name: 'endDate', type: 'date', label: 'End Date' },
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields[type].map(field => (
        <div key={field.name}>
          <label className="block">{field.label}:</label>
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(e, field.name)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
};

export default Form;