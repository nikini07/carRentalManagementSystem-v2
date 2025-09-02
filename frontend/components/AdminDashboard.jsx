/ src/components/AdminDashboard.jsx
import { useState } from 'react';

const AdminDashboard = ({
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
  const [selectedID, setSelectedID] = useState('');
  const [updateChoice, setUpdateChoice] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({});
    setSelectedID('');
    setUpdateChoice(null);
  };const addCar = () => {
    const { id, brand, model, type, year, capacity, rate } = formData;
    if (!id || !/^[A-Za-z]\d*$/.test(id)) {
      alert('Invalid Car ID. Must start with letter followed by digits.');
      return;
    }
    if (!brand || !model || !type) {
      alert('Brand, Model, Type cannot be empty.');
      return;
    }
    const y = parseInt(year);
    if (isNaN(y) || y < 1900 || y > 2025) {
      alert('Invalid year.');
      return;
    }
    const cap = parseInt(capacity);
    if (isNaN(cap) || cap <= 0) {
      alert('Invalid capacity.');
      return;
    }
    const r = parseFloat(rate);
    if (isNaN(r) || r <= 0) {
      alert('Invalid rate.');
      return;
    }
    const newCar = { carID: id, brand, model, type, year: y, capacity: cap, ratePerDay: r, available: true };
    setCars([...cars, newCar]);
    saveData();
    resetForm();
    setView('menu');
  };const addCustomer = () => {
    const { name, license, contact } = formData;
    if (!name || !license || !contact) {
      alert('All fields required.');
      return;
    }
    const id = generateCustomerID();
    const newCust = { customerID: id, name, licenseNumber: license, contactInfo: contact };
    setCustomers([...customers, newCust]);
    saveData();
    alert(`Customer added! ID: ${id}`);
    resetForm();
    setView('menu');
  };

  const findIndexByID = (list, id, idKey) => list.findIndex((item) => item[idKey] === id);

  const deleteCar = () => {
    const index = findIndexByID(cars, selectedID, 'carID');
    if (index === -1) {
      alert('Car not found.');
      return;
    }
    const newCars = [...cars];
    newCars.splice(index, 1);
    setCars(newCars);
    saveData();
    alert('Car deleted.');
    resetForm();
    setView('menu');
  };const updateCarField = () => {
    const index = findIndexByID(cars, selectedID, 'carID');
    if (index === -1) {
      alert('Car not found.');
      return;
    }
    const newCars = [...cars];
    switch (updateChoice) {
      case 'brand':
        newCars[index].brand = formData.brand;
        break;
      case 'model':
        newCars[index].model = formData.model;
        break;
      case 'type':
        newCars[index].type = formData.type;
        break;
      case 'year':
        const y = parseInt(formData.year);
        if (!isNaN(y)) newCars[index].year = y;
        break;
      case 'capacity':
        const cap = parseInt(formData.capacity);
        if (!isNaN(cap)) newCars[index].capacity = cap;
        break;
      case 'rate':
        const r = parseFloat(formData.rate);
        if (!isNaN(r)) newCars[index].ratePerDay = r;
        break;
      case 'available':
        newCars[index].available = formData.available === 'yes';
        break;
      default:
        return;
    }setCars(newCars);
    saveData();
    alert('Updated.');
    resetForm();
  };

  const deleteCustomer = () => {
    const index = findIndexByID(customers, selectedID, 'customerID');
    if (index === -1) {
      alert('Customer not found.');
      return;
    }
    const newCust = [...customers];
    newCust.splice(index, 1);
    setCustomers(newCust);
    saveData();
    alert('Customer deleted.');
    resetForm();
    setView('menu');
  };const updateCustomerField = () => {
    const index = findIndexByID(customers, selectedID, 'customerID');
    if (index === -1) {
      alert('Customer not found.');
      return;
    }
    const newCust = [...customers];
    switch (updateChoice) {
      case 'name':
        newCust[index].name = formData.name;
        break;
      case 'license':
        newCust[index].licenseNumber = formData.license;
        break;
      case 'contact':
        newCust[index].contactInfo = formData.contact;
        break;
      default:
        return;
    }
    setCustomers(newCust);
    saveData();
    alert('Updated.');
    resetForm();
  };

  const deleteBooking = () => {
    const index = findIndexByID(bookings, selectedID, 'bookingID');
    if (index === -1) {
      alert('Booking not found.');
      return;
    }
    const carID = bookings[index].carID;
    const newBookings = [...bookings];
    newBookings.splice(index, 1);
    setBookings(newBookings);
    const carIndex = findIndexByID(cars, carID, 'carID');
    if (carIndex !== -1) {
      const newCars = [...cars];
      newCars[carIndex].available = true;
      setCars(newCars);
    }
    saveData();
    alert('Booking deleted.');
    resetForm();
    setView('menu');
  };const updateBookingField = () => {
    const index = findIndexByID(bookings, selectedID, 'bookingID');
    if (index === -1) {
      alert('Booking not found.');
      return;
    }
    const newBk = [...bookings];
    switch (updateChoice) {
      case 'customerID':
        newBk[index].customerID = formData.customerID;
        break;
      case 'carID':
        newBk[index].carID = formData.carID;
        break;
      case 'startDate':
        const [sd, sm, sy] = formData.startDate.split('-').map(Number);
        newBk[index].startDate = { day: sd, month: sm, year: sy };
        break;
      case 'endDate':
        const [ed, em, ey] = formData.endDate.split('-').map(Number);
        newBk[index].endDate = { day: ed, month: em, year: ey };
        break;
      default:
        return;
    }
    setBookings(newBk);
    saveData();
    alert('Updated.');
    resetForm();
  };

  if (view === 'menu') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Admin Menu</h1>
        <button onClick={() => setView('viewCars')}>View Cars</button><br />
        <button onClick={() => setView('addCar')}>Add Car</button><br />
        <button onClick={() => setView('viewCustomers')}>View Customers</button><br />
        <button onClick={() => setView('addCustomer')}>Add Customer</button><br />
        <button onClick={() => setView('viewBookings')}>View Bookings</button><br />
        <button onClick={() => setView('updateCar')}>Update Car Details</button><br />
        <button onClick={() => setView('manageCustomers')}>Manage Customer Records</button><br />
        <button onClick={() => setView('manageBookings')}>Manage Booking Records</button><br />
        <button onClick={() => window.location.reload()}>Exit</button>
      </div>
    );
  }if (view === 'viewCars' || view === 'viewCustomers' || view === 'viewBookings') {
    let data = [];
    let headers = [];
    if (view === 'viewCars') {
      data = cars;
      headers = ['ID', 'Brand', 'Model', 'Type', 'Year', 'Capacity', 'Rate per day', 'Available'];
    } else if (view === 'viewCustomers') {
      data = customers;
      headers = ['ID', 'Name', 'License', 'Contact'];
    } else {
      data = bookings;
      headers = ['BookingID', 'CarID', 'CustomerID', 'Start Date', 'End Date'];
    }
    return (
      <div>
        <h1>{view.replace('view', 'View ')}</h1>
        <table border="1" style={{ margin: 'auto' }}>
          <thead>
            <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {view === 'viewCars' && (
                  <><td>{item.carID}</td>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>
                    <td>{item.type}</td>
                    <td>{item.year}</td>
                    <td>{item.capacity}</td>
                    <td>{item.ratePerDay.toFixed(2)}</td>
                    <td>{item.available ? 'Yes' : 'No'}</td>
                  </>
                )}
                {view === 'viewCustomers' && (
                  <>
                    <td>{item.customerID}</td>
                    <td>{item.name}</td>
                    <td>{item.licenseNumber}</td>
                    <td>{item.contactInfo}</td>
                  </>
                )}
                {view === 'viewBookings' && (
                  <>
                    <td>{item.bookingID}</td>
                    <td>{item.carID}</td>
                    <td>{item.customerID}</td>
                    <td>{`${item.startDate.day}-${item.startDate.month}-${item.startDate.year}`}</td>
                    <td>{`${item.endDate.day}-${item.endDate.month}-${item.endDate.year}`}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setView('menu')}>Back</button>
      </div>
    );
  }if (view === 'addCar') {
    return (
      <div>
        <h1>Add Car</h1>
        <input name="id" placeholder="ID" onChange={handleChange} /><br />
        <input name="brand" placeholder="Brand" onChange={handleChange} /><br />
        <input name="model" placeholder="Model" onChange={handleChange} /><br />
        <input name="type" placeholder="Type" onChange={handleChange} /><br />
        <input name="year" placeholder="Year" onChange={handleChange} /><br />
        <input name="capacity" placeholder="Capacity" onChange={handleChange} /><br />
        <input name="rate" placeholder="Rate per Day" onChange={handleChange} /><br />
        <button onClick={addCar}>Add</button>
        <button onClick={() => setView('menu')}>Cancel</button>
      </div>
    );
  }

  if (view === 'addCustomer') {
    return (
      <div>
        <h1>Add Customer</h1>
        <input name="name" placeholder="Name" onChange={handleChange} /><br />
        <input name="license" placeholder="License Number" onChange={handleChange} /><br />
        <input name="contact" placeholder="Contact Info" onChange={handleChange} /><br />
        <button onClick={addCustomer}>Add</button>
        <button onClick={() => setView('menu')}>Cancel</button>
      </div>
    );
  }if (view === 'updateCar' || view === 'manageCustomers' || view === 'manageBookings') {
    const isCar = view === 'updateCar';
    const isCust = view === 'manageCustomers';
    const isBk = view === 'manageBookings';
    if (!selectedID) {
      return (
        <div>
          <h1>{isCar ? 'Update/Delete Car' : isCust ? 'Manage Customer' : 'Manage Booking'}</h1>
          <input placeholder={`${isCar ? 'Car' : isCust ? 'Customer' : 'Booking'} ID`} onChange={(e) => setSelectedID(e.target.value)} /><br />
          <button onClick={() => setView(view)}>Next</button>  {/* Stay in view */}
          <button onClick={() => setView('menu')}>Cancel</button>
        </div>
      );
    }

    const handleDelete = () => {
      if (window.confirm('Confirm delete?')) {
        if (isCar) deleteCar();
        else if (isCust) deleteCustomer();
        else deleteBooking();
      }
    };

    if (updateChoice === 'delete') {
      handleDelete();
      return null;
    }

    if (!updateChoice) {
      return (
        <div>
          <h1>{isCar ? 'Update/Delete Car' : isCust ? 'Update/Delete Customer' : 'Update/Delete Booking'} - ID: {selectedID}</h1>
          <button onClick={() => setUpdateChoice('update')}>Update</button><br />
          <button onClick={() => setUpdateChoice('delete')}>Delete</button><br />
          <button onClick={() => setView('menu')}>Cancel</button>
        </div>
      );}

    return (
      <div>
        <h1>Update {isCar ? 'Car' : isCust ? 'Customer' : 'Booking'}</h1>
        {isCar && (
          <>
            <button onClick={() => setUpdateChoice('brand')}>Update Brand</button><br />
            <button onClick={() => setUpdateChoice('model')}>Update Model</button><br />
            <button onClick={() => setUpdateChoice('type')}>Update Type</button><br />
            <button onClick={() => setUpdateChoice('year')}>Update Year</button><br />
            <button onClick={() => setUpdateChoice('capacity')}>Update Capacity</button><br />
            <button onClick={() => setUpdateChoice('rate')}>Update Rate</button><br />
            <button onClick={() => setUpdateChoice('available')}>Update Availability</button><br />
          </>
        )}
        {isCust && (
          <>
            <button onClick={() => setUpdateChoice('name')}>Update Name</button><br />
            <button onClick={() => setUpdateChoice('license')}>Update License</button><br />
            <button onClick={() => setUpdateChoice('contact')}>Update Contact</button><br />
          </>
        )}
        {isBk && (
          <>
            <button onClick={() => setUpdateChoice('customerID')}>Update Customer ID</button><br />
            <button onClick={() => setUpdateChoice('carID')}>Update Car ID</button><br />
            <button onClick={() => setUpdateChoice('startDate')}>Update Start Date</button><br />
            <button onClick={() => setUpdateChoice('endDate')}>Update End Date</button><br />
          </>
        )}
        {updateChoice && (
          <div>
            <input name={updateChoice} placeholder={`New ${updateChoice}`} onChange={handleChange} /><br />
            <button onClick={isCar ? updateCarField : isCust ? updateCustomerField : updateBookingField}>Save</button>
          </div>
        )}
        <button onClick={() => resetForm()}>Back</button>
      </div>
    );
  }

  return null;
};

export default AdminDashboard;