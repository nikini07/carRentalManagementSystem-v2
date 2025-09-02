// src/components/CustomerDashboard.jsx
import { useState } from 'react';

const CustomerDashboard = ({
  cars,
  setCars,
  customers,
  setCustomers,
  bookings,
  setBookings,
  saveData,
  generateCustomerID,
  generateBookingID,
  dateLessThan,
}) => {
  const [view, setView] = useState('menu');
  const [formData, setFormData] = useState({});
  const [customerID, setCustomerID] = useState('');
  const [isExisting, setIsExisting] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({});
    setCustomerID('');
    setIsExisting(null);
  };

  const bookCar = () => {
    let custID = customerID;
    if (!isExisting) {
      const { name, license, contact } = formData;
      if (!name || !license || !contact) {
        alert('All fields required.');
        return;
      }
      custID = generateCustomerID();
      const newCust = { customerID: custID, name, licenseNumber: license, contactInfo: contact };
      setCustomers([...customers, newCust]);
    } else if (!customers.some((c) => c.customerID === custID)) {
      alert('Customer not found.');
      return;
    }

    const { carID, startDay, startMonth, startYear, endDay, endMonth, endYear } = formData;
    const car = cars.find((c) => c.carID === carID && c.available);
    if (!car) {
      alert('Car not available or not found.');
      return;
    }
    const startDate = { day: parseInt(startDay), month: parseInt(startMonth), year: parseInt(startYear) };
    const endDate = { day: parseInt(endDay), month: parseInt(endMonth), year: parseInt(endYear) };
    if (dateLessThan(endDate, startDate)) {
      alert('End date cannot be before start date.');
      return;
    }
    const bookingID = generateBookingID();
    const newBooking = { bookingID, carID, customerID: custID, startDate, endDate };
    setBookings([...bookings, newBooking]);
    const newCars = cars.map((c) => (c.carID === carID ? { ...c, available: false } : c));
    setCars(newCars);
    saveData();
    alert(`Booking successful! ID: ${bookingID}`);
    resetForm();
    setView('menu');
  };

  if (view === 'menu') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Customer Menu</h1>
        <button onClick={() => setView('viewCars')}>View Cars</button><br />
        <button onClick={() => setView('bookCar')}>Book a Car</button><br />
        <button onClick={() => setView('viewBookings')}>View Previous Bookings</button><br />
        <button onClick={() => window.location.reload()}>Exit</button>
      </div>
    );
  }

  if (view === 'viewCars') {
    return (
      <div>
        <h1>View Cars</h1>
        <table border="1" style={{ margin: 'auto' }}>
          <thead>
            <tr>
              <th>ID</th><th>Brand</th><th>Model</th><th>Type</th><th>Year</th><th>Capacity</th><th>Rate per day</th><th>Available</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.carID}>
                <td>{c.carID}</td><td>{c.brand}</td><td>{c.model}</td><td>{c.type}</td><td>{c.year}</td><td>{c.capacity}</td><td>{c.ratePerDay.toFixed(2)}</td><td>{c.available ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setView('menu')}>Back</button>
      </div>
    );
  }

  if (view === 'bookCar') {
    if (isExisting === null) {
      return (
        <div>
          <h1>Book Car</h1>
          <p>Are you an existing customer?</p>
          <button onClick={() => setIsExisting(true)}>Yes</button>
          <button onClick={() => setIsExisting(false)}>No</button>
          <button onClick={() => setView('menu')}>Cancel</button>
        </div>
      );
    }
    return (
      <div>
        <h1>Book Car</h1>
        {isExisting ? (
          <input placeholder="Customer ID" onChange={(e) => setCustomerID(e.target.value)} />
        ) : (
          <>
            <input name="name" placeholder="Name" onChange={handleChange} /><br />
            <input name="license" placeholder="License Number" onChange={handleChange} /><br />
            <input name="contact" placeholder="Contact Info" onChange={handleChange} /><br />
          </>
        )}<br />
        <input name="carID" placeholder="Car ID" onChange={handleChange} /><br />
        <p>Start Date:</p>
        <input name="startDay" placeholder="Day" onChange={handleChange} />
        <input name="startMonth" placeholder="Month" onChange={handleChange} />
        <input name="startYear" placeholder="Year" onChange={handleChange} /><br />
        <p>End Date:</p>
        <input name="endDay" placeholder="Day" onChange={handleChange} />
        <input name="endMonth" placeholder="Month" onChange={handleChange} />
        <input name="endYear" placeholder="Year" onChange={handleChange} /><br />
        <button onClick={bookCar}>Book</button>
        <button onClick={() => setView('menu')}>Cancel</button>
      </div>
    );
  }

  if (view === 'viewBookings') {
    if (!customerID) {
      return (
        <div>
          <h1>View Bookings</h1>
          <input placeholder="Customer ID" onChange={(e) => setCustomerID(e.target.value)} /><br />
          <button onClick={() => setView('viewBookings')}>View</button>
          <button onClick={() => setView('menu')}>Cancel</button>
        </div>
      );
    }
    const custBookings = bookings.filter((b) => b.customerID === customerID);
    if (custBookings.length === 0) {
      return (
        <div>
          <h1>No bookings found.</h1>
          <button onClick={() => setView('menu')}>Back</button>
        </div>
      );
    }
    return (
      <div>
        <h1>Your Bookings</h1>
        <table border="1" style={{ margin: 'auto' }}>
          <thead>
            <tr><th>BookingID</th><th>CarID</th><th>Start Date</th><th>End Date</th></tr>
          </thead>
          <tbody>
            {custBookings.map((b) => (
              <tr key={b.bookingID}>
                <td>{b.bookingID}</td><td>{b.carID}</td><td>{`${b.startDate.day}-${b.startDate.month}-${b.startDate.year}`}</td><td>{`${b.endDate.day}-${b.endDate.month}-${b.endDate.year}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setView('menu')}>Back</button>
      </div>
    );
  }

  return null;
};

export default CustomerDashboard;