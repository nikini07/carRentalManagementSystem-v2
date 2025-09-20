import { useState } from 'react';
   import axios from 'axios';

   const AdminDashboard = ({ cars, setCars, customers, setCustomers, bookings, setBookings, saveCar, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan, deleteCar, deleteCustomer, deleteBooking }) => {
     const [view, setView] = useState('menu');
     const [formData, setFormData] = useState({
       id: '', brand: '', model: '', type: '', year: '', capacity: '', rate: '',
       name: '', license: '', contact: '',
       carID: '', customerID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '',
       updateCarID: '', updateCarField: '', updateCarValue: '',
       updateCustomerID: '', updateCustomerField: '', updateCustomerValue: '',
       updateBookingID: '', updateBookingField: '', updateBookingValue: '',
       updateBookingStartDay: '', updateBookingStartMonth: '', updateBookingStartYear: '',
       updateBookingEndDay: '', updateBookingEndMonth: '', updateBookingEndYear: '',
       deleteCarID: '', deleteCustomerID: '', deleteBookingID: ''
     });
     const [isLoading, setIsLoading] = useState(false);

     const handleInputChange = (e) => {
       setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const resetForm = () => {
       setFormData({
         id: '', brand: '', model: '', type: '', year: '', capacity: '', rate: '',
         name: '', license: '', contact: '',
         carID: '', customerID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '',
         updateCarID: '', updateCarField: '', updateCarValue: '',
         updateCustomerID: '', updateCustomerField: '', updateCustomerValue: '',
         updateBookingID: '', updateBookingField: '', updateBookingValue: '',
         updateBookingStartDay: '', updateBookingStartMonth: '', updateBookingStartYear: '',
         updateBookingEndDay: '', updateBookingEndMonth: '', updateBookingEndYear: '',
         deleteCarID: '', deleteCustomerID: '', deleteBookingID: ''
       });
     };

     const addCar = async () => {
       setIsLoading(true);
       const { id, brand, model, type, year, capacity, rate } = formData;
       if (!id || !/^[A-Za-z]\d*$/.test(id)) {
         alert('Invalid Car ID. Must start with a letter followed by digits.');
         setIsLoading(false);
         return;
       }
       if (!brand || !model || !type) {
         alert('Brand, Model, Type cannot be empty.');
         setIsLoading(false);
         return;
       }
       const y = parseInt(year);
       if (isNaN(y) || y < 1900 || y > 2025) {
         alert('Invalid year.');
         setIsLoading(false);
         return;
       }
       const cap = parseInt(capacity);
       if (isNaN(cap) || cap <= 0) {
         alert('Invalid capacity.');
         setIsLoading(false);
         return;
       }
       const r = parseFloat(rate);
       if (isNaN(r) || r <= 0) {
         alert('Invalid rate.');
         setIsLoading(false);
         return;
       }
       try {
         await saveCar({ id, brand, model, type, year: y, capacity: cap, rate: r });
         alert('Car added successfully.');
         resetForm();
         setView('menu');
       } catch (error) {
         alert(error.message);
       }
       setIsLoading(false);
     };

     const addCustomer = async () => {
       setIsLoading(true);
       const { name, license, contact } = formData;
       if (!name || !license || !contact) {
         alert('All fields required.');
         setIsLoading(false);
         return;
       }
       try {
         await saveCustomer({ name, license, contact });
         alert('Customer added successfully.');
         resetForm();
         setView('menu');
       } catch (error) {
         alert(error.message);
       }
       setIsLoading(false);
     };

     const addBooking = async () => {
       setIsLoading(true);
       const { carID, customerID, startDay, startMonth, startYear, endDay, endMonth, endYear } = formData;
       const car = cars.find((c) => c.id === carID && c.available);
       if (!car) {
         alert('Car not available or not found.');
         setIsLoading(false);
         return;
       }
       if (!customers.some((c) => c.id === customerID)) {
         alert('Customer not found.');
         setIsLoading(false);
         return;
       }
       const startDate = { day: parseInt(startDay), month: parseInt(startMonth), year: parseInt(startYear) };
       const endDate = { day: parseInt(endDay), month: parseInt(endMonth), year: parseInt(endYear) };
       if (dateLessThan(endDate, startDate)) {
         alert('End date cannot be before start date.');
         setIsLoading(false);
         return;
       }
       const bookingID = generateBookingID();
       try {
         await saveBooking({ bookingID, carID, customerID, startDate, endDate });
         alert('Booking added successfully.');
         resetForm();
         setView('menu');
       } catch (error) {
         alert(error.message);
       }
       setIsLoading(false);
     };

     const updateCar = async () => {
       setIsLoading(true);
       const { updateCarID, updateCarField, updateCarValue } = formData;
       if (!updateCarID || !updateCarField || !updateCarValue) {
         alert('All fields required.');
         setIsLoading(false);
         return;
       }
       try {
         await axios.post('http://localhost:8080/updateCar', {
           id: updateCarID,
           field: updateCarField,
           value: updateCarValue
         });
         alert('Car updated successfully.');
         const res = await axios.get('http://localhost:8080/cars');
         setCars(res.data);
         resetForm();
         setView('menu');
       } catch (err) {
         alert('Failed to update car: ' + (err.response?.data?.message || 'Network error'));
       }
       setIsLoading(false);
     };

     const handleDeleteCar = async () => {
       setIsLoading(true);
       const { deleteCarID } = formData;
       if (!deleteCarID) {
         alert('Car ID required.');
         setIsLoading(false);
         return;
       }
       try {
         await deleteCar(deleteCarID);
         alert('Car deleted successfully.');
         resetForm();
         setView('menu');
       } catch (err) {
         alert('Failed to delete car: ' + (err.response?.data?.message || 'Network error'));
       }
       setIsLoading(false);
     };

     const updateCustomer = async () => {
       setIsLoading(true);
       const { updateCustomerID, updateCustomerField, updateCustomerValue } = formData;
       if (!updateCustomerID || !updateCustomerField || !updateCustomerValue) {
         alert('All fields required.');
         setIsLoading(false);
         return;
       }
       try {
         await axios.post('http://localhost:8080/updateCustomer', {
           id: updateCustomerID,
           field: updateCustomerField,
           value: updateCustomerValue
         });
         alert('Customer updated successfully.');
         const res = await axios.get('http://localhost:8080/customers');
         setCustomers(res.data);
         resetForm();
         setView('menu');
       } catch (err) {
         alert('Failed to update customer: ' + (err.response?.data?.message || 'Network error'));
       }
       setIsLoading(false);
     };

     const deleteCustomer = async () => {
       setIsLoading(true);
       const { deleteCustomerID } = formData;
       if (!deleteCustomerID) {
         alert('Customer ID required.');
         setIsLoading(false);
         return;
       }
       try {
         await deleteCustomer(deleteCustomerID);
         alert('Customer deleted successfully.');
         resetForm();
         setView('menu');
       } catch (err) {
         alert('Failed to delete customer: ' + (err.response?.data?.message || 'Network error'));
       }
       setIsLoading(false);
     };

     const updateBooking = async () => {
       setIsLoading(true);
       const { updateBookingID, updateBookingField, updateBookingValue, updateBookingStartDay, updateBookingStartMonth, updateBookingStartYear, updateBookingEndDay, updateBookingEndMonth, updateBookingEndYear } = formData;
       if (!updateBookingID || !updateBookingField) {
         alert('Booking ID and field required.');
         setIsLoading(false);
         return;
       }
       if ((updateBookingField === 'startDate' || updateBookingField === 'endDate') && (!updateBookingStartDay || !updateBookingStartMonth || !updateBookingStartYear || !updateBookingEndDay || !updateBookingEndMonth || !updateBookingEndYear)) {
         alert('Date fields required for date update.');
         setIsLoading(false);
         return;
       }
       if (updateBookingField !== 'startDate' && updateBookingField !== 'endDate' && !updateBookingValue) {
         alert('Value required for non-date fields.');
         setIsLoading(false);
         return;
       }
       try {
         const payload = {
           id: updateBookingID,
           field: updateBookingField,
           value: updateBookingField === 'startDate' || updateBookingField === 'endDate' ? '' : updateBookingValue,
           dateValue: updateBookingField === 'startDate' ? {
             day: parseInt(updateBookingStartDay),
             month: parseInt(updateBookingStartMonth),
             year: parseInt(updateBookingStartYear)
           } : updateBookingField === 'endDate' ? {
             day: parseInt(updateBookingEndDay),
             month: parseInt(updateBookingEndMonth),
             year: parseInt(updateBookingEndYear)
           } : {}
         };
         await axios.post('http://localhost:8080/updateBooking', payload);
         alert('Booking updated successfully.');
         const res = await axios.get('http://localhost:8080/bookings');
         setBookings(res.data);
         resetForm();
         setView('menu');
       } catch (err) {
         alert('Failed to update booking: ' + (err.response?.data?.message || 'Network error'));
       }
       setIsLoading(false);
     };

     const deleteBooking = async () => {
       setIsLoading(true);
       const { deleteBookingID } = formData;
       if (!deleteBookingID) {
         alert('Booking ID required.');
         setIsLoading(false);
         return;
       }
       try {
         await deleteBooking(deleteBookingID);
         alert('Booking deleted successfully.');
         resetForm();
         setView('menu');
       } catch (err) {
         alert('Failed to delete booking: ' + (err.response?.data?.message || 'Network error'));
       }
       setIsLoading(false);
     };

     return (
       <div className="container mx-auto p-6 bg-black min-h-screen text-white">
         <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
         {view === 'menu' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
             {[
               { label: 'Add Car', view: 'addCar' },
               { label: 'Add Customer', view: 'addCustomer' },
               { label: 'Add Booking', view: 'addBooking' },
               { label: 'Update Car', view: 'updateCar' },
               { label: 'Delete Car', view: 'deleteCar' },
               { label: 'Update Customer', view: 'updateCustomer' },
               { label: 'Delete Customer', view: 'deleteCustomer' },
               { label: 'Update Booking', view: 'updateBooking' },
               { label: 'Delete Booking', view: 'deleteBooking' },
               { label: 'View Cars', view: 'viewCars' },
               { label: 'View Customers', view: 'viewCustomers' },
               { label: 'View Bookings', view: 'viewBookings' },
             ].map((item) => (
               <button
                 key={item.view}
                 className="bg-lime-500 text-white px-6 py-4 rounded-lg shadow-md hover:bg-lime-600 transform hover:scale-105 transition-all duration-200"
                 onClick={() => setView(item.view)}
               >
                 {item.label}
               </button>
             ))}
           </div>
         )}
         {view === 'addCar' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Add New Car</h2>
             <div className="space-y-4">
               {[
                 { name: 'id', placeholder: 'Car ID (e.g., A123)', type: 'text' },
                 { name: 'brand', placeholder: 'Brand', type: 'text' },
                 { name: 'model', placeholder: 'Model', type: 'text' },
                 { name: 'type', placeholder: 'Type', type: 'text' },
                 { name: 'year', placeholder: 'Year', type: 'number' },
                 { name: 'capacity', placeholder: 'Capacity', type: 'number' },
                 { name: 'rate', placeholder: 'Rate per Day', type: 'number' },
               ].map((field) => (
                 <div key={field.name} className="flex flex-col">
                   <label className="text-sm font-medium mb-1 text-white">{field.placeholder}</label>
                   <input
                     type={field.type}
                     name={field.name}
                     value={formData[field.name]}
                     onChange={handleInputChange}
                     placeholder={field.placeholder}
                     className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                   />
                 </div>
               ))}
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                 onClick={addCar}
                 disabled={isLoading}
               >
                 {isLoading ? 'Adding...' : 'Add Car'}
               </button>
             </div>
           </div>
         )}
         {view === 'addCustomer' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Add New Customer</h2>
             <div className="space-y-4">
               {[
                 { name: 'name', placeholder: 'Name', type: 'text' },
                 { name: 'license', placeholder: 'License Number', type: 'text' },
                 { name: 'contact', placeholder: 'Contact Info', type: 'text' },
               ].map((field) => (
                 <div key={field.name} className="flex flex-col">
                   <label className="text-sm font-medium mb-1 text-white">{field.placeholder}</label>
                   <input
                     type={field.type}
                     name={field.name}
                     value={formData[field.name]}
                     onChange={handleInputChange}
                     placeholder={field.placeholder}
                     className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                   />
                 </div>
               ))}
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                 onClick={addCustomer}
                 disabled={isLoading}
               >
                 {isLoading ? 'Adding...' : 'Add Customer'}
               </button>
             </div>
           </div>
         )}
         {view === 'addBooking' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Add New Booking</h2>
             <div className="space-y-4">
               {[
                 { name: 'carID', placeholder: 'Car ID', type: 'text' },
                 { name: 'customerID', placeholder: 'Customer ID', type: 'text' },
                 { name: 'startDay', placeholder: 'Start Day', type: 'number' },
                 { name: 'startMonth', placeholder: 'Start Month', type: 'number' },
                 { name: 'startYear', placeholder: 'Start Year', type: 'number' },
                 { name: 'endDay', placeholder: 'End Day', type: 'number' },
                 { name: 'endMonth', placeholder: 'End Month', type: 'number' },
                 { name: 'endYear', placeholder: 'End Year', type: 'number' },
               ].map((field) => (
                 <div key={field.name} className="flex flex-col">
                   <label className="text-sm font-medium mb-1 text-white">{field.placeholder}</label>
                   <input
                     type={field.type}
                     name={field.name}
                     value={formData[field.name]}
                     onChange={handleInputChange}
                     placeholder={field.placeholder}
                     className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                   />
                 </div>
               ))}
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                 onClick={addBooking}
                 disabled={isLoading}
               >
                 {isLoading ? 'Adding...' : 'Add Booking'}
               </button>
             </div>
           </div>
         )}
         {view === 'updateCar' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Update Car</h2>
             <div className="space-y-4">
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">Car ID</label>
                 <input
                   type="text"
                   name="updateCarID"
                   value={formData.updateCarID}
                   onChange={handleInputChange}
                   placeholder="Car ID"
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 />
               </div>
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">Field to Update</label>
                 <select
                   name="updateCarField"
                   value={formData.updateCarField}
                   onChange={handleInputChange}
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 >
                   <option value="">Select Field</option>
                   <option value="brand">Brand</option>
                   <option value="model">Model</option>
                   <option value="type">Type</option>
                   <option value="year">Year</option>
                   <option value="capacity">Capacity</option>
                   <option value="ratePerDay">Rate per Day</option>
                   <option value="available">Available (yes/no)</option>
                 </select>
               </div>
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">New Value</label>
                 <input
                   type="text"
                   name="updateCarValue"
                   value={formData.updateCarValue}
                   onChange={handleInputChange}
                   placeholder="New Value"
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 />
               </div>
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                 onClick={updateCar}
                 disabled={isLoading}
               >
                 {isLoading ? 'Updating...' : 'Update Car'}
               </button>
             </div>
           </div>
         )}
         {view === 'deleteCar' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Delete Car</h2>
             <div className="flex flex-col">
               <label className="text-sm font-medium mb-1 text-white">Car ID</label>
               <input
                 type="text"
                 name="deleteCarID"
                 value={formData.deleteCarID}
                 onChange={handleInputChange}
                 placeholder="Car ID"
                 className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
               />
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                 onClick={handleDeleteCar}
                 disabled={isLoading}
               >
                 {isLoading ? 'Deleting...' : 'Delete Car'}
               </button>
             </div>
           </div>
         )}
         {view === 'updateCustomer' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Update Customer</h2>
             <div className="space-y-4">
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">Customer ID</label>
                 <input
                   type="text"
                   name="updateCustomerID"
                   value={formData.updateCustomerID}
                   onChange={handleInputChange}
                   placeholder="Customer ID"
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 />
               </div>
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">Field to Update</label>
                 <select
                   name="updateCustomerField"
                   value={formData.updateCustomerField}
                   onChange={handleInputChange}
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 >
                   <option value="">Select Field</option>
                   <option value="name">Name</option>
                   <option value="license">License Number</option>
                   <option value="contact">Contact Info</option>
                 </select>
               </div>
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">New Value</label>
                 <input
                   type="text"
                   name="updateCustomerValue"
                   value={formData.updateCustomerValue}
                   onChange={handleInputChange}
                   placeholder="New Value"
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 />
               </div>
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                 onClick={updateCustomer}
                 disabled={isLoading}
               >
                 {isLoading ? 'Updating...' : 'Update Customer'}
               </button>
             </div>
           </div>
         )}
         {view === 'deleteCustomer' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Delete Customer</h2>
             <div className="flex flex-col">
               <label className="text-sm font-medium mb-1 text-white">Customer ID</label>
               <input
                 type="text"
                 name="deleteCustomerID"
                 value={formData.deleteCustomerID}
                 onChange={handleInputChange}
                 placeholder="Customer ID"
                 className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
               />
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                 onClick={deleteCustomer}
                 disabled={isLoading}
               >
                 {isLoading ? 'Deleting...' : 'Delete Customer'}
               </button>
             </div>
           </div>
         )}
         {view === 'updateBooking' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Update Booking</h2>
             <div className="space-y-4">
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">Booking ID</label>
                 <input
                   type="text"
                   name="updateBookingID"
                   value={formData.updateBookingID}
                   onChange={handleInputChange}
                   placeholder="Booking ID"
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 />
               </div>
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1 text-white">Field to Update</label>
                 <select
                   name="updateBookingField"
                   value={formData.updateBookingField}
                   onChange={handleInputChange}
                   className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                 >
                   <option value="">Select Field</option>
                   <option value="customerID">Customer ID</option>
                   <option value="carID">Car ID</option>
                   <option value="startDate">Start Date</option>
                   <option value="endDate">End Date</option>
                 </select>
               </div>
               {formData.updateBookingField === 'startDate' || formData.updateBookingField === 'endDate' ? (
                 <div className="space-y-4">
                   <div className="flex flex-col">
                     <label className="text-sm font-medium mb-1 text-white">{formData.updateBookingField === 'startDate' ? 'Start Day' : 'End Day'}</label>
                     <input
                       type="number"
                       name={formData.updateBookingField === 'startDate' ? 'updateBookingStartDay' : 'updateBookingEndDay'}
                       value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartDay : formData.updateBookingEndDay}
                       onChange={handleInputChange}
                       placeholder={formData.updateBookingField === 'startDate' ? 'Start Day' : 'End Day'}
                       className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                     />
                   </div>
                   <div className="flex flex-col">
                     <label className="text-sm font-medium mb-1 text-white">{formData.updateBookingField === 'startDate' ? 'Start Month' : 'End Month'}</label>
                     <input
                       type="number"
                       name={formData.updateBookingField === 'startDate' ? 'updateBookingStartMonth' : 'updateBookingEndMonth'}
                       value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartMonth : formData.updateBookingEndMonth}
                       onChange={handleInputChange}
                       placeholder={formData.updateBookingField === 'startDate' ? 'Start Month' : 'End Month'}
                       className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                     />
                   </div>
                   <div className="flex flex-col">
                     <label className="text-sm font-medium mb-1 text-white">{formData.updateBookingField === 'startDate' ? 'Start Year' : 'End Year'}</label>
                     <input
                       type="number"
                       name={formData.updateBookingField === 'startDate' ? 'updateBookingStartYear' : 'updateBookingEndYear'}
                       value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartYear : formData.updateBookingEndYear}
                       onChange={handleInputChange}
                       placeholder={formData.updateBookingField === 'startDate' ? 'Start Year' : 'End Year'}
                       className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                     />
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col">
                   <label className="text-sm font-medium mb-1 text-white">New Value</label>
                   <input
                     type="text"
                     name="updateBookingValue"
                     value={formData.updateBookingValue}
                     onChange={handleInputChange}
                     placeholder="New Value"
                     className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                   />
                 </div>
               )}
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                 onClick={updateBooking}
                 disabled={isLoading}
               >
                 {isLoading ? 'Updating...' : 'Update Booking'}
               </button>
             </div>
           </div>
         )}
         {view === 'deleteBooking' && (
           <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">Delete Booking</h2>
             <div className="flex flex-col">
               <label className="text-sm font-medium mb-1 text-white">Booking ID</label>
               <input
                 type="text"
                 name="deleteBookingID"
                 value={formData.deleteBookingID}
                 onChange={handleInputChange}
                 placeholder="Booking ID"
                 className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
               />
             </div>
             <div className="flex justify-end space-x-4 mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                 onClick={() => setView('menu')}
                 disabled={isLoading}
               >
                 Back
               </button>
               <button
                 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                 onClick={deleteBooking}
                 disabled={isLoading}
               >
                 {isLoading ? 'Deleting...' : 'Delete Booking'}
               </button>
             </div>
           </div>
         )}
         {view === 'viewCars' && (
           <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">All Cars</h2>
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-lime-500 text-white">
                     <th className="p-3 text-left font-semibold">ID</th>
                     <th className="p-3 text-left font-semibold">Brand</th>
                     <th className="p-3 text-left font-semibold">Model</th>
                     <th className="p-3 text-left font-semibold">Type</th>
                     <th className="p-3 text-left font-semibold">Year</th>
                     <th className="p-3 text-left font-semibold">Capacity</th>
                     <th className="p-3 text-left font-semibold">Rate/Day</th>
                     <th className="p-3 text-left font-semibold">Available</th>
                   </tr>
                 </thead>
                 <tbody>
                   {cars.map((car, index) => (
                     <tr key={car.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                       <td className="p-3 text-white">{car.id}</td>
                       <td className="p-3 text-white">{car.brand}</td>
                       <td className="p-3 text-white">{car.model}</td>
                       <td className="p-3 text-white">{car.type}</td>
                       <td className="p-3 text-white">{car.year}</td>
                       <td className="p-3 text-white">{car.capacity}</td>
                       <td className="p-3 text-white">${car.rate.toFixed(2)}</td>
                       <td className="p-3">
                         <span className={`px-2 py-1 rounded-full text-sm ${car.available ? 'bg-lime-500 text-white' : 'bg-red-500 text-white'}`}>
                           {car.available ? 'Yes' : 'No'}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <div className="flex justify-end mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200"
                 onClick={() => setView('menu')}
               >
                 Back
               </button>
             </div>
           </div>
         )}
         {view === 'viewCustomers' && (
           <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">All Customers</h2>
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-lime-500 text-white">
                     <th className="p-3 text-left font-semibold">ID</th>
                     <th className="p-3 text-left font-semibold">Name</th>
                     <th className="p-3 text-left font-semibold">License</th>
                     <th className="p-3 text-left font-semibold">Contact</th>
                   </tr>
                 </thead>
                 <tbody>
                   {customers.map((cust, index) => (
                     <tr key={cust.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                       <td className="p-3 text-white">{cust.id}</td>
                       <td className="p-3 text-white">{cust.name}</td>
                       <td className="p-3 text-white">{cust.license}</td>
                       <td className="p-3 text-white">{cust.contact}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <div className="flex justify-end mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200"
                 onClick={() => setView('menu')}
               >
                 Back
               </button>
             </div>
           </div>
         )}
         {view === 'viewBookings' && (
           <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-6">All Bookings</h2>
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-lime-500 text-white">
                     <th className="p-3 text-left font-semibold">Booking ID</th>
                     <th className="p-3 text-left font-semibold">Car ID</th>
                     <th className="p-3 text-left font-semibold">Customer ID</th>
                     <th className="p-3 text-left font-semibold">Start Date</th>
                     <th className="p-3 text-left font-semibold">End Date</th>
                   </tr>
                 </thead>
                 <tbody>
                   {bookings.map((bk, index) => (
                     <tr key={bk.bookingID} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                       <td className="p-3 text-white">{bk.bookingID}</td>
                       <td className="p-3 text-white">{bk.carID}</td>
                       <td className="p-3 text-white">{bk.customerID}</td>
                       <td className="p-3 text-white">{`${bk.startDate.day}-${bk.startDate.month}-${bk.startDate.year}`}</td>
                       <td className="p-3 text-white">{`${bk.endDate.day}-${bk.endDate.month}-${bk.endDate.year}`}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <div className="flex justify-end mt-6">
               <button
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200"
                 onClick={() => setView('menu')}
               >
                 Back
               </button>
             </div>
           </div>
         )}
       </div>
     );
   };

   export default AdminDashboard;