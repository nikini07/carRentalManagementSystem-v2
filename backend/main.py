# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
from fpdf import FPDF
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

DATA_DIR = "data"
INVOICE_DIR = os.path.join(DATA_DIR, "invoices")
CHART_DIR = os.path.join(DATA_DIR, "charts")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(INVOICE_DIR, exist_ok=True)
os.makedirs(CHART_DIR, exist_ok=True)

CAR_FILE = os.path.join(DATA_DIR, "cars.json")
CUSTOMER_FILE = os.path.join(DATA_DIR, "customers.json")
BOOKING_FILE = os.path.join(DATA_DIR, "bookings.json")
INVOICE_FILE = os.path.join(DATA_DIR, "invoices.json")

class Date(BaseModel):
    day: int
    month: int
    year: int

class Car(BaseModel):
    id: str
    brand: str
    model: str
    type: str
    year: int
    capacity: int
    rate: float
    available: bool = True

class Customer(BaseModel):
    id: str
    name: str
    license: str
    contact: str

class Booking(BaseModel):
    bookingID: str
    carID: str
    customerID: str
    startDate: Date
    endDate: Date

class Invoice(BaseModel):
    invoiceID: str
    bookingID: str
    amount: float
    date: Date

class AddCar(BaseModel):
    id: str
    brand: str
    model: str
    type: str
    year: int
    capacity: int
    rate: float

class AddCustomer(BaseModel):
    name: str
    license: str
    contact: str

class AddBooking(BaseModel):
    carID: str
    customerID: str
    startDate: Date
    endDate: Date

class UpdateBody(BaseModel):
    id: str
    field: str
    value: str | int | float | bool | None
    dateValue: Optional[Date] = None

class DeleteBody(BaseModel):
    id: str

class RentalSystem:
    def __init__(self):
        self.cars: List[Car] = self._load(CAR_FILE, Car)
        self.customers: List[Customer] = self._load(CUSTOMER_FILE, Customer)
        self.bookings: List[Booking] = self._load(BOOKING_FILE, Booking)
        self.invoices: List[Invoice] = self._load(INVOICE_FILE, Invoice)

    def _load(self, file_path: str, cls):
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                data = json.load(f)
            if cls == Booking:
                return [cls(**d, startDate=Date(**d['startDate']), endDate=Date(**d['endDate'])) for d in data]
            elif cls == Invoice:
                return [cls(**d, date=Date(**d['date'])) for d in data]
            return [cls(**d) for d in data]
        return []

    def _save(self, file_path: str, items: List):
        with open(file_path, 'w') as f:
            json.dump([item.dict() for item in items], f, indent=4)

    def generate_id(self, prefix: str, items: List) -> str:
        max_num = 0
        for item in items:
            id_str = item.id if prefix in ['C', 'I'] else item.bookingID
            if id_str.startswith(prefix):
                num = int(id_str[1:])
                max_num = max(max_num, num)
        return f"{prefix}{max_num + 1:03d}"

    def calculate_days(self, start: Date, end: Date) -> int:
        from datetime import date
        delta = date(end.year, end.month, end.day) - date(start.year, start.month, start.day)
        return max(delta.days, 1)

app = FastAPI()
system = RentalSystem()

@app.get("/cars", response_model=List[Car])
def get_cars():
    return system.cars

@app.get("/customers", response_model=List[Customer])
def get_customers():
    return system.customers

@app.get("/bookings", response_model=List[Booking])
def get_bookings():
    return system.bookings

@app.get("/invoices", response_model=List[Invoice])
def get_invoices():
    return system.invoices

@app.get("/charts/{chart_name}")
def get_chart(chart_name: str):
    chart_path = os.path.join(CHART_DIR, f"{chart_name}.png")
    if not os.path.exists(chart_path):
        raise HTTPException(status_code=404, detail="Chart not found")
    return FileResponse(chart_path)

@app.get("/invoices/pdf/{booking_id}")
def get_invoice_pdf(booking_id: str):
    invoice_path = os.path.join(INVOICE_DIR, f"invoice_{booking_id}.pdf")
    if not os.path.exists(invoice_path):
        raise HTTPException(status_code=404, detail="Invoice not found")
    return FileResponse(invoice_path)

@app.post("/cars")
def add_car(car: AddCar):
    if any(c.id == car.id for c in system.cars):
        raise HTTPException(status_code=400, detail="Car ID already exists")
    new_car = Car(**car.dict(), available=True)
    system.cars.append(new_car)
    system._save(CAR_FILE, system.cars)
    return {"message": "Car added successfully"}

@app.post("/customers")
def add_customer(customer: AddCustomer):
    id = system.generate_id('C', system.customers)
    new_customer = Customer(id=id, **customer.dict())
    system.customers.append(new_customer)
    system._save(CUSTOMER_FILE, system.customers)
    return {"message": "Customer added successfully", "id": id}

@app.post("/bookings")
def add_booking(booking: AddBooking):
    car = next((c for c in system.cars if c.id == booking.carID and c.available), None)
    if not car:
        raise HTTPException(status_code=400, detail="Car not available or not found")
    customer = next((c for c in system.customers if c.id == booking.customerID), None)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if booking.endDate < booking.startDate:
        raise HTTPException(status_code=400, detail="End date cannot be before start date")
    booking_id = system.generate_id('B', system.bookings)
    new_booking = Booking(bookingID=booking_id, **booking.dict())
    system.bookings.append(new_booking)
    car.available = False
    system._save(BOOKING_FILE, system.bookings)
    system._save(CAR_FILE, system.cars)

    # Generate invoice
    days = system.calculate_days(booking.startDate, booking.endDate)
    amount = days * car.rate
    now = datetime.now()
    invoice_id = system.generate_id('I', system.invoices)
    invoice = Invoice(invoiceID=invoice_id, bookingID=booking_id, amount=amount, date=Date(day=now.day, month=now.month, year=now.year))
    system.invoices.append(invoice)
    system._save(INVOICE_FILE, system.invoices)

    # Generate PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Car Rental Invoice", ln=1, align='C')
    pdf.cell(200, 10, txt=f"Invoice ID: {invoice_id}", ln=1)
    pdf.cell(200, 10, txt=f"Booking ID: {booking_id}", ln=1)
    pdf.cell(200, 10, txt=f"Customer ID: {booking.customerID}", ln=1)
    pdf.cell(200, 10, txt=f"Car: {car.brand} {car.model} ({car.id})", ln=1)
    pdf.cell(200, 10, txt=f"Period: {booking.startDate.day}-{booking.startDate.month}-{booking.startDate.year} to {booking.endDate.day}-{booking.endDate.month}-{booking.endDate.year}", ln=1)
    pdf.cell(200, 10, txt=f"Days: {days}", ln=1)
    pdf.cell(200, 10, txt=f"Rate: ${car.rate:.2f}/day", ln=1)
    pdf.cell(200, 10, txt=f"Total: ${amount:.2f}", ln=1)
    pdf.cell(200, 10, txt=f"Issue Date: {now.strftime('%Y-%m-%d')}", ln=1)
    pdf.output(os.path.join(INVOICE_DIR, f"invoice_{booking_id}.pdf"))

    return {"message": "Booking added successfully", "bookingID": booking_id}

@app.post("/updateCar")
def update_car(body: UpdateBody):
    car = next((c for c in system.cars if c.id == body.id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if body.field not in ['brand', 'model', 'type', 'year', 'capacity', 'rate', 'available']:
        raise HTTPException(status_code=400, detail="Invalid field")
    try:
        if body.field in ['year', 'capacity']:
            setattr(car, body.field, int(body.value))
        elif body.field == 'rate':
            setattr(car, body.field, float(body.value))
        elif body.field == 'available':
            setattr(car, body.field, body.value == 'true')
        else:
            setattr(car, body.field, body.value)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid value type")
    system._save(CAR_FILE, system.cars)
    return {"message": "Car updated successfully"}

@app.post("/updateCustomer")
def update_customer(body: UpdateBody):
    customer = next((c for c in system.customers if c.id == body.id), None)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if body.field not in ['name', 'license', 'contact']:
        raise HTTPException(status_code=400, detail="Invalid field")
    setattr(customer, body.field, body.value)
    system._save(CUSTOMER_FILE, system.customers)
    return {"message": "Customer updated successfully"}

@app.post("/updateBooking")
def update_booking(body: UpdateBody):
    booking = next((b for b in system.bookings if b.bookingID == body.id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if body.field not in ['carID', 'customerID', 'startDate', 'endDate']:
        raise HTTPException(status_code=400, detail="Invalid field")
    if body.field in ['startDate', 'endDate']:
        if not body.dateValue:
            raise HTTPException(status_code=400, detail="dateValue required")
        setattr(booking, body.field, body.dateValue)
    else:
        if body.field == 'carID':
            old_car = next((c for c in system.cars if c.id == booking.carID), None)
            if old_car:
                old_car.available = True
            new_car = next((c for c in system.cars if c.id == body.value and c.available), None)
            if not new_car:
                raise HTTPException(status_code=400, detail="New car not available or not found")
            new_car.available = False
            system._save(CAR_FILE, system.cars)
        elif body.field == 'customerID':
            if not any(c.id == body.value for c in system.customers):
                raise HTTPException(status_code=404, detail="Customer not found")
        setattr(booking, body.field, body.value)
    system._save(BOOKING_FILE, system.bookings)
    return {"message": "Booking updated successfully"}

@app.post("/deleteCar")
def delete_car(body: DeleteBody):
    if any(b.carID == body.id for b in system.bookings):
        raise HTTPException(status_code=400, detail="Cannot delete car with active bookings")
    system.cars = [c for c in system.cars if c.id != body.id]
    system._save(CAR_FILE, system.cars)
    return {"message": "Car deleted successfully"}

@app.post("/deleteCustomer")
def delete_customer(body: DeleteBody):
    if any(b.customerID == body.id for b in system.bookings):
        raise HTTPException(status_code=400, detail="Cannot delete customer with active bookings")
    system.customers = [c for c in system.customers if c.id != body.id]
    system._save(CUSTOMER_FILE, system.customers)
    return {"message": "Customer deleted successfully"}

@app.post("/deleteBooking")
def delete_booking(body: DeleteBody):
    booking = next((b for b in system.bookings if b.bookingID == body.id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    car = next((c for c in system.cars if c.id == booking.carID), None)
    if car:
        car.available = True
    system.bookings = [b for b in system.bookings if b.bookingID != body.id]
    system.invoices = [i for i in system.invoices if i.bookingID != body.id]
    system._save(BOOKING_FILE, system.bookings)
    system._save(CAR_FILE, system.cars)
    system._save(INVOICE_FILE, system.invoices)
    invoice_path = os.path.join(INVOICE_DIR, f"invoice_{body.id}.pdf")
    if os.path.exists(invoice_path):
        os.remove(invoice_path)
    return {"message": "Booking deleted successfully"}

@app.post("/generateStats")
def generate_stats():
    if not system.bookings:
        raise HTTPException(status_code=400, detail="No bookings for stats")
    df = pd.DataFrame([b.dict() for b in system.bookings])
    df['startDate'] = df['startDate'].apply(lambda d: f"{d['year']}-{d['month']:02d}")
    bookings_per_month = df.groupby('startDate').size()

    plt.figure(figsize=(10, 5))
    bookings_per_month.plot(kind='bar')
    plt.title('Bookings per Month')
    plt.xlabel('Month')
    plt.ylabel('Number of Bookings')
    chart_path = os.path.join(CHART_DIR, 'bookings_per_month.png')
    plt.savefig(chart_path)
    plt.close()

    df['car_type'] = df['carID'].apply(lambda cid: next((c.type for c in system.cars if c.id == cid), 'Unknown'))
    type_counts = df['car_type'].value_counts()
    plt.figure(figsize=(8, 8))
    type_counts.plot(kind='pie', autopct='%1.1f%%')
    plt.title('Bookings by Car Type')
    chart_path2 = os.path.join(CHART_DIR, 'bookings_by_type.png')
    plt.savefig(chart_path2)
    plt.close()

    revenue = sum(system.calculate_days(b.startDate, b.endDate) * next((c.rate for c in system.cars if c.id == b.carID), 0) for b in system.bookings)
    return {"message": "Charts generated", "charts": ["bookings_per_month.png", "bookings_by_type.png"], "total_revenue": revenue}

# Run: uvicorn main:app --reload --port 8080