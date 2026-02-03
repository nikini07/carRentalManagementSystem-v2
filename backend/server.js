const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data
let vehicles = [
  { id: 1, name: 'Tesla Model 3', type: 'Electric Sedan', pricePerDay: 80 },
  { id: 2, name: 'Ford F-150', type: 'Pickup Truck', pricePerDay: 60 },
  { id: 3, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 50 },
  { id: 4, name: 'BMW X5', type: 'SUV', pricePerDay: 100 }
];

let customers = [];

let bookings = [];

// Get all vehicles
app.get('/vehicles', (req, res) => {
  res.json(vehicles);
});

// Get vehicles with availability (current or for dates)
app.get('/vehicles/available', (req, res) => {
  const { start, end } = req.query;
  const now = new Date();
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const availableVehicles = vehicles.filter(v => {
      const overlapping = bookings.some(b => b.vehicleId === v.id &&
        !(endDate < b.startDate || startDate > b.endDate));
      return !overlapping;
    });
    res.json(availableVehicles);
  } else {
    // Current availability
    const availableVehicles = vehicles.map(v => {
      const isAvailable = !bookings.some(b => b.vehicleId === v.id && b.startDate <= now && b.endDate >= now);
      return { ...v, available: isAvailable };
    });
    res.json(availableVehicles);
  }
});

// Create booking
app.post('/bookings', (req, res) => {
  const { name, email, vehicleId, start, end } = req.body;
  if (!name || !email || !vehicleId || !start || !end) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
    return res.status(400).json({ error: 'Invalid date range' });
  }
  const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  const overlapping = bookings.some(b => b.vehicleId === vehicle.id &&
    !(endDate < b.startDate || startDate > b.endDate));
  if (overlapping) {
    return res.status(400).json({ error: 'Vehicle not available in selected date range' });
  }
  let customer = customers.find(c => c.email === email);
  if (!customer) {
    const customerId = customers.length + 1;
    customer = { id: customerId, name, email };
    customers.push(customer);
  }
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const totalPrice = days * vehicle.pricePerDay;
  const bookingId = bookings.length + 1;
  const booking = { id: bookingId, vehicleId: vehicle.id, customerId: customer.id, startDate, endDate, totalPrice };
  bookings.push(booking);
  res.json({ success: true, bookingId });
});

// Get all customers (admin only, but open for simplicity)
app.get('/customers', (req, res) => {
  res.json(customers);
});

// Get all bookings (admin only, but open for simplicity)
app.get('/bookings', (req, res) => {
  res.json(bookings.map(b => {
    const vehicle = vehicles.find(v => v.id === b.vehicleId);
    const customer = customers.find(c => c.id === b.customerId);
    return { ...b, vehicleName: vehicle?.name, customerName: customer?.name };
  }));
});

// Add vehicle (admin)
app.post('/vehicles', (req, res) => {
  const { name, type, pricePerDay } = req.body;
  if (!name || !type || !pricePerDay) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const id = vehicles.length + 1;
  vehicles.push({ id, name, type, pricePerDay: parseFloat(pricePerDay) });
  res.json({ success: true });
});

// Generate PDF invoice
app.get('/invoice/:bookingId', (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  const vehicle = vehicles.find(v => v.id === booking.vehicleId);
  const customer = customers.find(c => c.id === booking.customerId);

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${bookingId}.pdf`);
  doc.pipe(res);

  doc.fontSize(25).text('Rental Invoice', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(12).text(`Booking ID: ${booking.id}`);
  doc.text(`Customer: ${customer.name} (${customer.email})`);
  doc.text(`Vehicle: ${vehicle.name} (${vehicle.type})`);
  doc.text(`Rental Period: ${booking.startDate.toDateString()} to ${booking.endDate.toDateString()}`);
  doc.text(`Total Price: $${booking.totalPrice.toFixed(2)}`);
  doc.moveDown(1);
  doc.text('Thank you for renting with us!', { align: 'center' });

  doc.end();
});

app.listen(5000, () => console.log('Backend server running on http://localhost:5000'));