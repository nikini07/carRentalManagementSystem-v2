#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <exception>
#include "httplib.h"
#include "json.hpp"

using namespace std;
using json = nlohmann::json;

// Struct: Date
struct Date {
    int day, month, year;

    string toString() const {
        return to_string(day) + "-" + to_string(month) + "-" + to_string(year);
    }

    bool operator<(const Date& other) const {
        if (year != other.year)
            return year < other.year;
        if (month != other.month)
            return month < other.month;
        return day < other.day;
    }

    bool operator==(const Date& other) const {
        return day == other.day && month == other.month && year == other.year;
    }

    friend ostream& operator<<(ostream& out, const Date& date);
    friend istream& operator>>(istream& in, Date& date);
};

ostream& operator<<(ostream& out, const Date& date) {
    out << date.day << " " << date.month << " " << date.year;
    return out;
}

istream& operator>>(istream& in, Date& date) {
    in >> date.day >> date.month >> date.year;
    return in;
}

// Class: Car
class Car {
private:
    string carID;
    string brand;
    string type;
    int capacity;
    bool available;
    string model;
    int year;
    double ratePerDay;

public:
    Car() {}
    Car(string id, string b, string t, int c, bool a = true, string m = "", int y = 0, double rate = 0.0) {
        carID = id;
        brand = b;
        type = t;
        capacity = c;
        available = a;
        model = m;
        year = y;
        ratePerDay = rate;
    }

    string getID() const { return carID; }
    string getBrand() const { return brand; }
    string getType() const { return type; }
    int getCapacity() const { return capacity; }
    bool isAvailable() const { return available; }
    string getModel() const { return model; }
    int getYear() const { return year; }
    double getRatePerDay() const { return ratePerDay; }

    void setBrand(string b) { brand = b; }
    void setType(string t) { type = t; }
    void setCapacity(int c) { capacity = c; }
    void setAvailability(bool a) { available = a; }
    void setModel(string m) { model = m; }
    void setYear(int y) { year = y; }
    void setRatePerDay(double rate) { ratePerDay = rate; }

    string serialize() const {
        ostringstream oss;
        oss << fixed << setprecision(2);
        oss << carID << " " << brand << " " << model << " " << type << " "
            << year << " " << capacity << " " << ratePerDay << " " << (available ? "true" : "false");
        return oss.str();
    }

    void deserialize(string id, string b, string t, string m, int y, int c, double rate, bool a) {
        carID = id;
        brand = b;
        type = t;
        model = m;
        year = y;
        capacity = c;
        ratePerDay = rate;
        available = a;
    }
};

// Class: Customer
class Customer {
private:
    string customerID;
    string name;
    string licenseNumber;
    string contactInfo;

public:
    Customer() {}
    Customer(string id, string n, string l, string c) {
        customerID = id;
        name = n;
        licenseNumber = l;
        contactInfo = c;
    }

    string getID() const { return customerID; }
    string getName() const { return name; }
    string getLicenseNumber() const { return licenseNumber; }
    string getContactInfo() const { return contactInfo; }

    void setName(string n) { name = n; }
    void setLicenseNumber(string ln) { licenseNumber = ln; }
    void setContactInfo(string ci) { contactInfo = ci; }

    string serialize() const {
        return customerID + " " + name + " " + licenseNumber + " " + contactInfo;
    }

    void deserialize(string id, string n, string l, string p) {
        customerID = id;
        name = n;
        licenseNumber = l;
        contactInfo = p;
    }
};

// Class: Booking
class Booking {
private:
    string bookingID;
    string carID;
    string customerID;
    Date startDate;
    Date endDate;

public:
    Booking() {}
    Booking(string bid, string cid, string cuid, Date start, Date end) {
        bookingID = bid;
        carID = cid;
        customerID = cuid;
        startDate = start;
        endDate = end;
    }

    string getBookingID() const { return bookingID; }
    string getCarID() const { return carID; }
    string getCustomerID() const { return customerID; }
    Date getStartDate() const { return startDate; }
    Date getEndDate() const { return endDate; }

    void setBookingID(string id) { bookingID = id; }
    void setCarID(string cid) { carID = cid; }
    void setCustomerID(string cuid) { customerID = cuid; }
    void setStartDate(Date sd) { startDate = sd; }
    void setEndDate(Date ed) { endDate = ed; }

    string serialize() const {
        return bookingID + " " + carID + " " + customerID + " "
               + to_string(startDate.day) + "-" + to_string(startDate.month) + "-" + to_string(startDate.year) + " "
               + to_string(endDate.day) + "-" + to_string(endDate.month) + "-" + to_string(endDate.year);
    }

    void deserialize(string bid, string cid, string cusid, Date start, Date end) {
        bookingID = bid;
        carID = cid;
        customerID = cusid;
        startDate = start;
        endDate = end;
    }
};

// Class: rentalSystem
class rentalSystem {
private:
    vector<Car> cars;
    vector<Customer> customers;
    vector<Booking> bookings;

    void loadCars() {
        ifstream file("backend/cars.txt");
        if (!file.is_open()) {
            cout << "Warning: Could not open backend/cars.txt for loading. Starting with empty car list.\n";
            return;
        }
        string id, brand, type, model, available;
        int year, capacity;
        double rate;
        while (file >> id >> brand >> model >> type >> year >> capacity >> rate >> available) {
            Car c;
            c.deserialize(id, brand, type, model, year, capacity, rate, available == "true");
            cars.push_back(c);
        }
        file.close();
    }

    void saveCars() {
        ofstream file("backend/cars.txt");
        if (!file) {
            throw runtime_error("Error opening car file for writing.");
        }
        for (size_t i = 0; i < cars.size(); i++) {
            file << cars[i].serialize() << endl;
        }
        file.close();
    }

    void loadCustomers() {
        ifstream file("backend/customers.txt");
        if (!file.is_open()) {
            cout << "Warning: Could not open backend/customers.txt for loading. Starting with empty customer list.\n";
            return;
        }
        string id, name, license, contact;
        while (file >> id >> name >> license >> contact) {
            Customer cust;
            cust.deserialize(id, name, license, contact);
            customers.push_back(cust);
        }
        file.close();
    }

    void saveCustomers() {
        ofstream file("backend/customers.txt");
        if (!file) {
            throw runtime_error("Error opening customer file for writing.");
        }
        for (size_t i = 0; i < customers.size(); ++i) {
            file << customers[i].serialize() << endl;
        }
        file.close();
    }

    void loadBookings() {
        ifstream file("backend/bookings.txt");
        if (!file.is_open()) {
            cout << "Warning: Could not open backend/bookings.txt for loading. Starting with empty booking list.\n";
            return;
        }
        string bid, cid, cuid;
        Date start, end;
        while (file >> bid >> cid >> cuid >> start >> end) {
            Booking bk;
            bk.deserialize(bid, cid, cuid, start, end);
            bookings.push_back(bk);
        }
        file.close();
    }

    void saveBookings() {
        ofstream file("backend/bookings.txt");
        if (!file) {
            throw runtime_error("Error opening booking file for writing.");
        }
        for (size_t i = 0; i < bookings.size(); i++) {
            file << bookings[i].serialize() << endl;
        }
        file.close();
    }

public:
    rentalSystem() {
        loadCars();
        loadCustomers();
        loadBookings();
    }

    string generateCustomerID() {
        int maxID = 0;
        for (size_t i = 0; i < customers.size(); ++i) {
            string id = customers[i].getID().substr(1);
            try {
                int num = stoi(id);
                if (num > maxID) maxID = num;
            } catch (...) {
                continue;
            }
        }
        maxID++;
        ostringstream oss;
        oss << "C" << setw(3) << setfill('0') << maxID;
        return oss.str();
    }

    string generateBookingID() {
        int maxID = 0;
        for (size_t i = 0; i < bookings.size(); ++i) {
            string id = bookings[i].getBookingID().substr(1);
            try {
                int num = stoi(id);
                if (num > maxID) maxID = num;
            } catch (...) {
                continue;
            }
        }
        maxID++;
        ostringstream oss;
        oss << "B" << setw(3) << setfill('0') << maxID;
        return oss.str();
    }

    void addCar(const Car& car) {
        cars.push_back(car);
        saveCars();
    }

    void addCustomer(const Customer& cust) {
        customers.push_back(cust);
        saveCustomers();
    }

    void addBooking(const Booking& bk) {
        bookings.push_back(bk);
        for (size_t i = 0; i < cars.size(); i++) {
            if (cars[i].getID() == bk.getCarID()) {
                cars[i].setAvailability(false);
                break;
            }
        }
        saveBookings();
        saveCars();
    }

    bool updateCar(string id, string field, string value) {
        for (size_t i = 0; i < cars.size(); i++) {
            if (cars[i].getID() == id) {
                if (field == "brand") {
                    cars[i].setBrand(value);
                } else if (field == "model") {
                    cars[i].setModel(value);
                } else if (field == "type") {
                    cars[i].setType(value);
                } else if (field == "year") {
                    try {
                        int newYear = stoi(value);
                        if (newYear < 1900 || newYear > 2025) throw runtime_error("Invalid year: must be between 1900 and 2025.");
                        cars[i].setYear(newYear);
                    } catch (...) {
                        throw runtime_error("Invalid year format.");
                    }
                } else if (field == "capacity") {
                    try {
                        int newCap = stoi(value);
                        if (newCap <= 0) throw runtime_error("Invalid capacity: must be positive.");
                        cars[i].setCapacity(newCap);
                    } catch (...) {
                        throw runtime_error("Invalid capacity format.");
                    }
                } else if (field == "ratePerDay") {
                    try {
                        double newRate = stod(value);
                        if (newRate <= 0) throw runtime_error("Invalid rate: must be positive.");
                        cars[i].setRatePerDay(newRate);
                    } catch (...) {
                        throw runtime_error("Invalid rate format.");
                    }
                } else if (field == "available") {
                    bool isAvail = (value == "yes" || value == "Yes" || value == "true");
                    cars[i].setAvailability(isAvail);
                } else {
                    throw runtime_error("Invalid field for car update.");
                }
                saveCars();
                return true;
            }
        }
        throw runtime_error("Car not found.");
    }

    bool deleteCar(string id) {
        for (size_t i = 0; i < cars.size(); i++) {
            if (cars[i].getID() == id) {
                cars.erase(cars.begin() + i);
                saveCars();
                return true;
            }
        }
        throw runtime_error("Car not found.");
    }

    bool updateCustomer(string id, string field, string value) {
        for (size_t i = 0; i < customers.size(); i++) {
            if (customers[i].getID() == id) {
                if (field == "name") {
                    if (value.empty()) throw runtime_error("Name cannot be empty.");
                    customers[i].setName(value);
                } else if (field == "license") {
                    if (value.empty()) throw runtime_error("License cannot be empty.");
                    customers[i].setLicenseNumber(value);
                } else if (field == "contact") {
                    if (value.empty()) throw runtime_error("Contact cannot be empty.");
                    customers[i].setContactInfo(value);
                } else {
                    throw runtime_error("Invalid field for customer update.");
                }
                saveCustomers();
                return true;
            }
        }
        throw runtime_error("Customer not found.");
    }

    bool deleteCustomer(string id) {
        for (size_t i = 0; i < customers.size(); i++) {
            if (customers[i].getID() == id) {
                customers.erase(customers.begin() + i);
                saveCustomers();
                return true;
            }
        }
        throw runtime_error("Customer not found.");
    }

    bool updateBooking(string id, string field, string value, Date dateValue = {0, 0, 0}) {
        for (size_t i = 0; i < bookings.size(); i++) {
            if (bookings[i].getBookingID() == id) {
                if (field == "customerID") {
                    if (value.empty()) throw runtime_error("Customer ID cannot be empty.");
                    bookings[i].setCustomerID(value);
                } else if (field == "carID") {
                    if (value.empty()) throw runtime_error("Car ID cannot be empty.");
                    bookings[i].setCarID(value);
                } else if (field == "startDate") {
                    if (dateValue.day <= 0 || dateValue.month <= 0 || dateValue.year <= 0)
                        throw runtime_error("Invalid start date.");
                    bookings[i].setStartDate(dateValue);
                } else if (field == "endDate") {
                    if (dateValue.day <= 0 || dateValue.month <= 0 || dateValue.year <= 0)
                        throw runtime_error("Invalid end date.");
                    bookings[i].setEndDate(dateValue);
                } else {
                    throw runtime_error("Invalid field for booking update.");
                }
                saveBookings();
                return true;
            }
        }
        throw runtime_error("Booking not found.");
    }

    bool deleteBooking(string id) {
        for (size_t i = 0; i < bookings.size(); i++) {
            if (bookings[i].getBookingID() == id) {
                string carID = bookings[i].getCarID();
                for (size_t j = 0; j < cars.size(); j++) {
                    if (cars[j].getID() == carID) {
                        cars[j].setAvailability(true);
                        break;
                    }
                }
                bookings.erase(bookings.begin() + i);
                saveBookings();
                saveCars();
                return true;
            }
        }
        throw runtime_error("Booking not found.");
    }

    const vector<Car>& getCars() const { return cars; }
    const vector<Customer>& getCustomers() const { return customers; }
    const vector<Booking>& getBookings() const { return bookings; }
};

// JSON serialization for structs
void to_json(json& j, const Date& date) {
    j = json{{"day", date.day}, {"month", date.month}, {"year", date.year}};
}

void from_json(const json& j, Date& date) {
    try {
        j.at("day").get_to(date.day);
        j.at("month").get_to(date.month);
        j.at("year").get_to(date.year);
        if (date.day <= 0 || date.month <= 0 || date.year <= 0) {
            throw runtime_error("Invalid date: day, month, and year must be positive.");
        }
    } catch (...) {
        throw runtime_error("Invalid date format in JSON.");
    }
}

void to_json(json& j, const Car& car) {
    j = json{
        {"id", car.getID()},
        {"brand", car.getBrand()},
        {"type", car.getType()},
        {"capacity", car.getCapacity()},
        {"available", car.isAvailable()},
        {"model", car.getModel()},
        {"year", car.getYear()},
        {"rate", car.getRatePerDay()}
    };
}

void from_json(const json& j, Car& car) {
    string id, brand, type, model;
    int capacity, year;
    double rate;
    bool available;
    try {
        j.at("id").get_to(id);
        j.at("brand").get_to(brand);
        j.at("type").get_to(type);
        j.at("capacity").get_to(capacity);
        j.at("available").get_to(available);
        j.at("model").get_to(model);
        j.at("year").get_to(year);
        j.at("rate").get_to(rate);
        if (id.empty()) throw runtime_error("Car ID cannot be empty.");
        if (brand.empty()) throw runtime_error("Brand cannot be empty.");
        if (type.empty()) throw runtime_error("Type cannot be empty.");
        if (capacity <= 0) throw runtime_error("Capacity must be positive.");
        if (year < 1900 || year > 2025) throw runtime_error("Year must be between 1900 and 2025.");
        if (rate < 0) throw runtime_error("Rate cannot be negative.");
    } catch (...) {
        throw runtime_error("Invalid car data in JSON.");
    }
    car.deserialize(id, brand, type, model, year, capacity, rate, available);
}

void to_json(json& j, const Customer& cust) {
    j = json{
        {"id", cust.getID()},
        {"name", cust.getName()},
        {"license", cust.getLicenseNumber()},
        {"contact", cust.getContactInfo()}
    };
}

void from_json(const json& j, Customer& cust) {
    string id, name, license, contact;
    try {
        j.at("id").get_to(id);
        j.at("name").get_to(name);
        j.at("license").get_to(license);
        j.at("contact").get_to(contact);
        if (name.empty()) throw runtime_error("Name cannot be empty.");
        if (license.empty()) throw runtime_error("License cannot be empty.");
        if (contact.empty()) throw runtime_error("Contact cannot be empty.");
    } catch (...) {
        throw runtime_error("Invalid customer data in JSON.");
    }
    cust.deserialize(id, name, license, contact);
}

void to_json(json& j, const Booking& bk) {
    j = json{
        {"bookingID", bk.getBookingID()},
        {"carID", bk.getCarID()},
        {"customerID", bk.getCustomerID()},
        {"startDate", bk.getStartDate()},
        {"endDate", bk.getEndDate()}
    };
}

void from_json(const json& j, Booking& bk) {
    string bid, cid, cuid;
    Date start, end;
    try {
        j.at("bookingID").get_to(bid);
        j.at("carID").get_to(cid);
        j.at("customerID").get_to(cuid);
        j.at("startDate").get_to(start);
        j.at("endDate").get_to(end);
        if (cid.empty()) throw runtime_error("Car ID cannot be empty.");
        if (cuid.empty()) throw runtime_error("Customer ID cannot be empty.");
    } catch (...) {
        throw runtime_error("Invalid booking data in JSON.");
    }
    bk.deserialize(bid, cid, cuid, start, end);
}

int main() {
    rentalSystem rs;
    httplib::Server svr;

    svr.Get("/cars", [&rs](const httplib::Request&, httplib::Response& res) {
        try {
            json j = rs.getCars();
            res.set_content(j.dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 500;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get("/customers", [&rs](const httplib::Request&, httplib::Response& res) {
        try {
            json j = rs.getCustomers();
            res.set_content(j.dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 500;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get("/bookings", [&rs](const httplib::Request&, httplib::Response& res) {
        try {
            json j = rs.getBookings();
            res.set_content(j.dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 500;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/cars", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            if (j["id"].get<string>().empty() || !isalpha(j["id"].get<string>()[0])) {
                throw runtime_error("Invalid Car ID: must be non-empty and start with a letter.");
            }
            if (j["brand"].get<string>().empty()) throw runtime_error("Brand cannot be empty.");
            if (j["type"].get<string>().empty()) throw runtime_error("Type cannot be empty.");
            if (j["capacity"].get<int>() <= 0) throw runtime_error("Capacity must be positive.");
            if (j["year"].get<int>() < 1900 || j["year"].get<int>() > 2025) throw runtime_error("Year must be between 1900 and 2025.");
            if (j["rate"].get<double>() < 0) throw runtime_error("Rate cannot be negative.");
            Car car;
            from_json(j, car);
            rs.addCar(car);
            res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/customers", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            if (j["name"].get<string>().empty()) throw runtime_error("Name cannot be empty.");
            if (j["license"].get<string>().empty()) throw runtime_error("License cannot be empty.");
            if (j["contact"].get<string>().empty()) throw runtime_error("Contact cannot be empty.");
            Customer cust;
            string id = rs.generateCustomerID();
            j["id"] = id;
            from_json(j, cust);
            rs.addCustomer(cust);
            res.set_content(nlohmann::json({ {"status", "success"}, {"id", id} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/bookings", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            if (j["carID"].get<string>().empty()) throw runtime_error("Car ID cannot be empty.");
            if (j["customerID"].get<string>().empty()) throw runtime_error("Customer ID cannot be empty.");
            Booking bk;
            j["bookingID"] = rs.generateBookingID();
            from_json(j, bk);
            bool validCar = false;
            for (size_t i = 0; i < rs.getCars().size(); i++) {
                if (rs.getCars()[i].getID() == bk.getCarID() && rs.getCars()[i].isAvailable()) {
                    validCar = true;
                    break;
                }
            }
            bool validCustomer = false;
            for (size_t i = 0; i < rs.getCustomers().size(); i++) {
                if (rs.getCustomers()[i].getID() == bk.getCustomerID()) {
                    validCustomer = true;
                    break;
                }
            }
            if (!validCar) {
                throw runtime_error("Car not available or not found.");
            }
            if (!validCustomer) {
                throw runtime_error("Customer not found.");
            }
            if (bk.getEndDate() < bk.getStartDate()) {
                throw runtime_error("End date must not be before start date.");
            }
            rs.addBooking(bk);
            res.set_content(nlohmann::json({ {"status", "success"}, {"bookingID", bk.getBookingID()} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/updateCar", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            string id = j["id"].get<string>();
            string field = j["field"].get<string>();
            string value = j["value"].get<string>();
            if (id.empty()) throw runtime_error("Car ID cannot be empty.");
            if (field.empty()) throw runtime_error("Field cannot be empty.");
            bool success = rs.updateCar(id, field, value);
            res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/deleteCar", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            string id = j["id"].get<string>();
            if (id.empty()) throw runtime_error("Car ID cannot be empty.");
            bool success = rs.deleteCar(id);
            res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/updateCustomer", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            string id = j["id"].get<string>();
            string field = j["field"].get<string>();
            string value = j["value"].get<string>();
            if (id.empty()) throw runtime_error("Customer ID cannot be empty.");
            if (field.empty()) throw runtime_error("Field cannot be empty.");
            bool success = rs.updateCustomer(id, field, value);
            res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/deleteCustomer", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            string id = j["id"].get<string>();
            if (id.empty()) throw runtime_error("Customer ID cannot be empty.");
            bool success = rs.deleteCustomer(id);
            res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/updateBooking", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            string id = j["id"].get<string>();
            string field = j["field"].get<string>();
            if (id.empty()) throw runtime_error("Booking ID cannot be empty.");
            if (field.empty()) throw runtime_error("Field cannot be empty.");
            if (field == "startDate" || field == "endDate") {
                Date dateValue = j["dateValue"].get<Date>();
                bool success = rs.updateBooking(id, field, "", dateValue);
                res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
            } else {
                string value = j["value"].get<string>();
                bool success = rs.updateBooking(id, field, value);
                res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
            }
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/deleteBooking", [&rs](const httplib::Request& req, httplib::Response& res) {
        try {
            json j = json::parse(req.body);
            string id = j["id"].get<string>();
            if (id.empty()) throw runtime_error("Booking ID cannot be empty.");
            bool success = rs.deleteBooking(id);
            res.set_content(nlohmann::json({ {"status", "success"} }).dump(), "application/json");
        } catch (const exception& e) {
            res.set_content(nlohmann::json({ {"status", "error"}, {"message", string(e.what())} }).dump(), "application/json");
            res.status = 400;
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.listen("localhost", 8080);
    return 0;
}