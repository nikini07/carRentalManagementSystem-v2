#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>

using namespace std;

// Struct: Date
// Purpose: Represents a calendar date with day, month, and year.
// Provides functions to input, output, compare, and format dates.
struct Date {
    int day, month, year;

    string toString() const {
        return to_string(day) + "-" + to_string(month) + "-" + to_string(year);
    }

    void input() {
        cout << "Enter day: "; cin >> day;
        cout << "Enter month: "; cin >> month;
        cout << "Enter year: "; cin >> year;
    }

    // Overload the '<' operator for Date comparison
    bool operator<(const Date& other) const {
        if (year != other.year)
            return year < other.year;
        if (month != other.month)
            return month < other.month;
        return day < other.day;
    }

    // Overload the '==' operator for Date comparison
    bool operator==(const Date& other) const {
        return day == other.day && month == other.month && year == other.year;
    }

    // Declare friend functions for I/O operators
    friend ostream& operator<<(ostream& out, const Date& date);
    friend istream& operator>>(istream& in, Date& date);
};

// Define << operator for Date
ostream& operator<<(ostream& out, const Date& date) {
    out << date.day << " " << date.month << " " << date.year;
    return out;
}

// Define >> operator for Date
istream& operator>>(istream& in, Date& date) {
    in >> date.day >> date.month >> date.year;
    return in;
}


// Class: Car
// Purpose: Represents a car in the rental system with related attributes and  
// functionality for displaying, serializing, and deserializing car data.
class Car {
    private:
    string carID;
    string brand;
    string type;
    int capacity;
    bool available;
    //new
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

    //getters
    string getID() const { return carID; }
    string getBrand() const { return brand; }
    string getType() const { return type; }
    int getCapacity() const { return capacity; }
    bool isAvailable() const { return available; }
    string getModel() const { return model; }
    int getYear() const { return year; }
    double getRatePerDay() const { return ratePerDay; }

    //setters
    void setBrand(string b) { brand = b; }
    void setType(string t) { type = t; }
    void setCapacity(int c) { capacity = c; }
    void setAvailability(bool a) { available = a; }
    void setModel(string m) { model = m; }
    void setYear(int y) { year = y; }
    void setRatePerDay(double rate) { ratePerDay = rate; }

    void display() const {
        cout << setw(10) << carID 
             << setw(14) << brand
             << setw(12) << model
             << setw(12) << type
             << setw(12) << year
             << setw(16) << capacity
             << setw(24) << fixed << setprecision(2) << ratePerDay
             << setw(18) << (available ? "Yes" : "No") << endl;
    }

    string serialize() const {
        ostringstream oss;
        oss << fixed << setprecision(2);  // Limit decimals to 2
        oss << carID << " " << brand << " " << model << " " << type << " "
        << year << " " << capacity << " " << ratePerDay << " " << available;
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
// Purpose: Represents a customer in the rental system with related attributes and 
// functionality for displaying, serializing, and deserializing customer data.
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

    //setters 
    void setName(string n) { name = n; }
    void setLicenseNumber(string ln) { licenseNumber = ln; }
    void setContactInfo(string ci) { contactInfo = ci; }

    void display() const {
        cout << setw(10) << customerID 
             << setw(12) << name
             << setw(16) << licenseNumber 
             << setw(20) << contactInfo << endl;
    }
    
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
// Purpose: Represents a booking in the rental system, containing details about the car,
// customer, and the rental period. 
//Includes functionality for displaying, serializing, and deserializing booking data.
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


    void display() const {
        cout << setw(10) << bookingID 
             << setw(12) << carID
             << setw(16) << customerID
             << setw(15) << startDate.toString()
             << setw(15) << endDate.toString() << endl;
    }

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
// Purpose: Represents the core rental system which holds and manages collections of cars, 
// customers, and bookings. It includes functionality to add, remove, view,
// load from files, and save data for cars, customers, and bookings.
class rentalSystem {
    private:
    //vectors to store cars customer and booking objects
    vector<Car> cars;
    vector<Customer> customers;
    vector<Booking> bookings;

    public:


// Function: loadCars
// Purpose: Loads car data from a file cars.txt into the cars vector.
// If the file cannot be opened or read, it displays an error message.
    void loadCars() {
        // Open the file containing car data
        ifstream file("/Users/nikki/Documents/CarRentalSystem/cars.txt"); 
        
        // Check if the file opened successfully
        if (!file.is_open()) {
            cout << "Error: Could not open the file for loading car data.\n";
            return;
        }

        // Variables to hold each car data while reading from the file
        string id;
        string brand;
        string type;
        string model;
        int year;
        int capacity;
        double rate;
        bool available;

        // Read each car's details from the file and deserialize into Car objects
        while (file >> id >> brand >> model >> type >> year >> capacity >> rate >> available) {
            Car c;  // Create a temporary Car object
            c.deserialize(id, brand, model, type, year, capacity, rate, available);
            cars.push_back(c);  // Add the car object to the 'cars' vector
        }
        
        file.close();
    }


// Function: saveCars
// Purpose : Writes all car objects from the cars vector to cars.txt
    void saveCars() {
        ofstream file("/Users/nikki/Documents/CarRentalSystem/cars.txt"); 
        // Check if file opened successfully
        if (!file) {
            cout << "Error opening cars file for writing.\n";
            return;  //eExit if the file couldn't be opened.
        }
        
        // Iterate through all cars and write serialized data to the file
        for (size_t i = 0; i < cars.size(); i++) { 
            file << cars[i].serialize() << endl; 
        }

        file.flush();
        file.close();
    }


// Function: loadCustomers
// Purpose: Loads customer data from a file customers.txt into the customers vector.
// If the file cannot be opened or read, it displays an error message.
    void loadCustomers() {
        ifstream file("/Users/nikki/Documents/CarRentalSystem/customers.txt");

        // Check if the file opened successfully
        if (!file.is_open()) {
            cout << "Error: Could not open the file for loading customer data.\n";
            return;
        }

        // Variables to hold each customer's data while reading from the file
        string id;
        string name;
        string license;
        string contactInfo;

        // Read each customer's details from the file and deserialize into Customer objects
        while (file >> id >> name >> license >> contactInfo) {
            Customer cust;  // Create a temporary Customer object
            cust.deserialize(id, name, license, contactInfo);
            customers.push_back(cust);  // Add the customer object to the 'customers' vector
        }

        file.close();
    }


// Function: saveCustomers
// Purpose : Writes all customer objects from the customers vector to customers.txt.
    void saveCustomers() {
        ofstream outFile("/Users/nikki/Documents/CarRentalSystem/customers.txt");
        // Check if file opened successfully
        if (!outFile) {
            cout << "Error opening customer file for writing.\n";
            return;
        }

        // Write each customer to the file
        for (size_t i = 0; i < customers.size(); ++i) {
            const Customer& cust = customers[i];
            outFile << customers[i].serialize() << endl;
        }
        
        outFile.flush();
        outFile.close();
    }


// Function: loadBookings
// Purpose: Loads booking data from a file bookings.txt into the bookings vector.
// The function reads booking details from the file and uses the 'deserialize' method to convert the data into Booking objects.
// If the file cannot be opened or read, it displays an error message.
    void loadBookings() {
        ifstream file("/Users/nikki/Documents/CarRentalSystem/bookings.txt");

        // Check if the file opened successfully
        if (!file.is_open()) {
            cout << "Error: Could not open the file for loading booking data.\n";
            return;
        }

        // Variables to hold each booking's data while reading from the file
        string bid; 
        string cid; 
        string cuid;
        Date start;
        Date end;

        // Read each booking's details from the file and deserialize into Booking objects
        while (file >> bid >> cid >> cuid >> start >> end) {
            Booking bk;  // Create a temporary Booking object
            bk.deserialize(bid, cid, cuid, start, end);
            bookings.push_back(bk); 
        }

        file.close();
    }


// Function: saveBookings
// Purpose : Writes all booking objects from the bookings vector to bookings.txt.
    void saveBookings() {
        ofstream outFile("/Users/nikki/Documents/CarRentalSystem/bookings.txt");
        // Check if file opened successfully
        if (!outFile) {
            cout << "Error opening bookings file for writing.\n";
            return;
        }
        // Write each booking to the file
        for (size_t i = 0; i < bookings.size(); i++) {
            outFile << bookings[i].serialize() << endl;
        }

        outFile.flush();
        outFile.close();
    }


// Function: addCar
// Purpose: Adds a new car to the system by collecting car details from the user.
// Includes validation for input fields like year, capacity, and rate per day.
    void addCar() {
        string id;
        string brand;
        string model;
        string type;
        int year;
        int capacity;
        double rate;
        bool available = true;

        // Ask for Car details and validate inputs
        cout << "Enter Car ID (e.g., C001): "; 
        cin >> id;
        
        // Validate Car ID format (e.g., starts with a letter and followed by digits)
        if (id.empty() || !isalpha(id[0])) {
            cout << "Invalid Car ID. It must start with a letter.\n";
            return;
        }
        for (size_t i = 1; i < id.length(); i++) {
            if (!isdigit(id[i])) {
                cout << "Invalid Car ID. The remaining characters must be digits.\n";
                return;
            }
        }

        cout << "Enter Brand: "; 
        cin >> ws; 
        getline(cin, brand);
        if (brand.empty()) {
            cout << "Brand cannot be empty.\n";
            return;
        }

        cout << "Enter Model: "; 
        getline(cin, model);
        if (model.empty()) {
            cout << "Model cannot be empty.\n";
            return;
        }

        cout << "Enter Type (e.g. SUV/Sedan): "; 
        getline(cin, type);
        if (type.empty()) {
            cout << "Type cannot be empty.\n";
            return;

        }
        cout << "Enter Year: "; 
        cin >> year;
        if (cin.fail() || year < 1900 || year > 2025) {
            cin.clear();
            cin.ignore(1000, '\n');
            cout << "Invalid input for Year. Please enter a valid year between 1900 and 2025.\n";
            return;
        }

        cout << "Enter Capacity: "; 
        cin >> capacity;
        if (cin.fail() || capacity <= 0) {
            cin.clear();
            cin.ignore(1000, '\n');
            cout << "Invalid input for Capacity. Please enter a positive number.\n";
            return;
        }

        cout << "Enter Rate per Day: "; 
        cin >> rate;
        if (cin.fail() || rate <= 0) {
            cin.clear();
            cin.ignore(1000, '\n');
            cout << "Invalid input for Rate. Please enter a positive number.\n";
            return;
        }

        // Create new car object and add it to the cars vector
        Car newCar(id, brand, model, capacity, available, type, year, rate);
        cars.push_back(newCar);
        saveCars();

        cout << "Car added successfully.\n";
    } 


// Function: viewCars
// Purpose: Displays all cars currently stored in the system with proper formatting.
// If no cars are available, notifies the user.
    void viewCars() {
        // Check if the car list is empty
        if (cars.empty()) {
            cout << "No cars available.\n";
            return;
        }

        // Print table headers with spacing using setw
        cout << setw(10) << "ID" 
             << setw(14) << "Brand"
             << setw(12) << "Model"
             << setw(12) << "Type"
             << setw(12) << "Year" 
             << setw(16) << "Capacity" 
             << setw(24) << "Rate per day"
             << setw(18) << "Available" << endl;

        // Iterate through each car and display its details
        for (size_t i = 0; i < cars.size(); i++) { 
            cars[i].display();
        }
    }


// Function: addCustomer
// Purpose: Prompts the admin to input customer details, generates a unique ID,
// creates a Customer object, saves it to the system, and confirms success.
    void addCustomer() {
        string name;
        string license;
        string contactInfo;

        //print asking customer details from user
        cout << "Enter Name (e.g. Sam): "; 
        cin.ignore(); 
        getline(cin, name);

        // Check for empty name
        if (name.empty()) {
            cout << "Name cannot be empty.\n";
            return;
        }

        cout << "Enter License Number: "; 
        getline(cin, license);
        if (license.empty()) {
            cout << "License Number cannot be empty.\n";
            return;
        }

        cout << "Enter Phone Number: "; 
        getline(cin, contactInfo);
        if (contactInfo.empty()) {
            cout << "Phone Number cannot be empty. Customer not added.\n";
            return;
        }

        // Generate unique ID and create the customer object
        string id = generateCustomerID();
        Customer newCustomer(id, name, license, contactInfo);
        customers.push_back(newCustomer);
        saveCustomers();

        cout << "Customer added successfully!\nCustomer ID: " << id << "\n";
    }


// Function: viewCustomers
// Purpose: Displays all customers currently stored in the system in a tabular format.
// If no customers exist, it will notify the user.
    void viewCustomers() {
        // Check if there are any customers
        if (customers.empty()) {
            cout << "No customers found in the system.\n";
            return;
        }

        // Print table header with proper spacing
        cout << setw(10) << "ID" 
             << setw(12) << "Name" 
             << setw(16) << "License" 
             << setw(20) << "Phone Number" << endl;

         // Iterate through the customer list and print each customer's details
        for (size_t i = 0; i < customers.size(); i++) {  
            customers[i].display();
        }
    }


    string generateCustomerID() {
        int maxID = 0;
        for (int i = 0; i < customers.size(); ++i) {
            Customer customer = customers[i];
            string id = customer.getID().substr(1); 
            int num = stoi(id);
            if (num > maxID) maxID = num;
        }
        maxID++;
        ostringstream oss;
        oss << "C" << setw(3) << setfill('0') << maxID;
        return oss.str();
    }
    
    string generateBookingID() {
        int maxID = 0;
        for (int i = 0; i < bookings.size(); ++i) {
            Booking booking = bookings[i];
            string id = booking.getBookingID().substr(1); 
            int num = stoi(id);
            if (num > maxID) maxID = num;
        }
        maxID++;
        ostringstream oss;
        oss << "B" << setw(3) << setfill('0') << maxID;
        return oss.str();
    }



// Function: bookCar
// Purpose: Handles the booking process by either retrieving an existing customer
// or registering a new one. It validates car availability, takes booking dates, 
// and saves the booking with updated car availability.
    void bookCar() {
        string customerID;
        string name;
        string license;
        string contact;

        cout << "Are you an existing customer? (y/n): ";
        char isExistingCustomer;
        cin >> isExistingCustomer;

        // Handle invalid input and keep asking until valid input is given
        while (isExistingCustomer != 'y' && isExistingCustomer != 'n') {
            cout << "Invalid input! Please enter 'y' for Yes or 'n' for No: ";
            cin >> isExistingCustomer;
        }

        if (isExistingCustomer == 'y' || isExistingCustomer == 'Y') {
            // Existing customer: Prompt for Customer ID
            cout << "Enter your Customer ID: ";
            cin >> customerID;

            bool customerFound = false;
            for (size_t i = 0; i < customers.size(); i++) {
                if (customers[i].getID() == customerID) {
                    customerFound = true;
                    break;
                }
            }

            if (!customerFound) {
                cout << "Customer not found.\n";
                return;
            }
        } else {
            // New customer registration
            cout << "Let's create a customer profile before booking.\n";
            cout << "Enter Name: "; 
            cin.ignore(); 
            getline(cin, name);

            cout << "Enter License Number: "; 
            getline(cin, license);

            cout << "Enter Contact Info: "; 
            getline(cin, contact);

            customerID = generateCustomerID();
            Customer newCustomer(customerID, name, license, contact);
            customers.push_back(newCustomer);
            saveCustomers();

            cout << "Your Customer ID is: " << customerID << "\n";
        }

        // Prompt for Car ID and check availability
        string carID;
        cout << "Enter Car ID to book: "; 
        cin >> carID;

        bool validCar = false;
        for (size_t i = 0; i < cars.size(); i++) {
            if (cars[i].getID() == carID && cars[i].isAvailable()) {
                validCar = true;
                break;
            }
        }

        if (!validCar) {
            cout << "Car not available or not found.\n";
            return;
        }

        // Booking dates input
        Date startDate;
        Date endDate;
        
        // Check car availability
        for (size_t i = 0; i < cars.size(); i++) {
            if (cars[i].getID() == carID && cars[i].isAvailable()) {
                validCar = true;
                break;
            }
        }
        if (!validCar) {
            cout << "Car not available or not found.\n";
            return;
        }

        // Prompt for and validate booking dates
        bool validDates = false;
        while (!validDates) {
            cout << "Enter booking start date:\n";
            startDate.input();  // Assumes input() internally validates format

            cout << "Enter booking end date:\n";
            endDate.input();

            // Simple logical check (assumes you overload comparison operators)
            if (endDate < startDate) {
                cout << "End date cannot be earlier than start date. Please re-enter.\n";
            } else {
                validDates = true;
            }
        }

        // Create and add booking
        string bookingID = generateBookingID();

        Booking newBooking;
        newBooking.setBookingID(bookingID);
        newBooking.setCustomerID(customerID);
        newBooking.setCarID(carID);
        newBooking.setStartDate(startDate);
        newBooking.setEndDate(endDate);

        bookings.push_back(newBooking);

        //update car availability
        for (size_t i = 0; i < cars.size(); i++) {;
            if (cars[i].getID() == carID) {
                cars[i].setAvailability(false);
                break;
            }
        }

        saveBookings();
        saveCars();

        cout << "Booking successful!\n";
        cout << "Your Booking ID is: " << bookingID << "\n";
    }


// Function: viewBookings
// Purpose: Displays the list of bookings. Optionally filters bookings by customer ID if provided.
// Handles invalid inputs if customerID is given. 
    void viewBookings(string customerID = "") {
        // Check if there are any customers
        if (bookings.empty()) {
            cout << "No bookings found in the system.\n";
            return;
        }
    
        // Display table headers for the bookings
        cout << setw(10) << "BookingID"
             << setw(12) << "CarID"
             << setw(16) << "CustomerID"
             << setw(20) << "Start Date"
             << setw(18) << "End Date" << endl;

        // Check if a customerID was passed and validate it
        if (!customerID.empty()) {
            bool customerExists = false;

            // Verify if the provided customerID is valid
            for (size_t i = 0; i < customers.size(); i++) {
                if (customers[i].getID() == customerID) {
                    customerExists = true;
                    break;
                }
            }

            // If the customerID doesn't exist, display an error message
            if (!customerExists) {
                cout << "Invalid Customer ID provided. Please check the ID and try again.\n";
                return;
            }
        }

        // Iterate through the bookings and display them
        bool foundBooking = false;
        for (size_t i = 0; i < bookings.size(); i++) {
            // If a customerID is provided, only show matching bookings
            if (customerID.empty() || bookings[i].getCustomerID() == customerID) {
                bookings[i].display();
                foundBooking = true;
            }
        }

        // If no bookings were found, notify the user
        if (!foundBooking) {
            cout << "No bookings found for the specified customer.\n";
        }
    }


// Function: updateCarDetails
// Purpose: Allows Admin to update or delete a car's details from the inventory.
// Provides input validation, retry logic, and user-friendly prompts.
    void updateCarDetails() {
        int choice;
        bool validChoice = false;

        // Menu for update or delete
        while (!validChoice) {
            cout << "\n Update Car Details \n";
            cout << "1. Update a Car\n";
            cout << "2. Delete a Car\n";
            cout << "Enter your choice: ";
            cin >> choice;   

            // Input validation: Ensure choice is a number
            if (cin.fail()) {
                cin.clear();
                cin.ignore(1000, '\n');
                cout << "Invalid input. Please enter a number.\n";
                return; // Exit early if input is invalid

            } else if (choice == 1 || choice == 2) {
                validChoice = true;  // Valid input received 
            
            } else {
                cout << "Invalid choice. Please enter 1 or 2.\n";
            }
        }

        // Clear leftover newline before getline
        cin.ignore();
        string id;
        cout << "Enter Car ID: ";
        cin >> id;

        int index = -1;
        bool found = false;

        // Search for car
        for (size_t i = 0; i < cars.size(); i++) {
            if (cars[i].getID() == id) {
                index = i;
                found = true;
                break;
            }
        }

        // If not found, offer retry
        while (!found) {
            cout << "Car not found.\n";
            char retry;
            cout << "Would you like to try again? (y/n): ";
            cin >> retry;
            if (retry != 'y' && retry != 'Y') {
                cout << "Returning to Admin Menu.\n";
                return;
            }
            cout << "Enter Car ID: ";
            cin >> id;
            for (size_t i = 0; i < cars.size(); i++) {
                if (cars[i].getID() == id) {
                    index = i;
                    found = true;
                    break;
                }
            }
        }
        
        // If user chose to delete the customer
        if (choice == 2) {
            cars.erase(cars.begin() + index);
            saveCars();
            cout << "Car deleted successfully.\n";
            return;
        }

        // Begin update loop
        bool updating = true;
        while (updating) {
            cout << "\nSelect the detail you want to update.\n";
            cout << "1. Brand\n";
            cout << "2. Model\n";
            cout << "3. Type\n";
            cout << "4. Year\n";
            cout << "5. Capacity\n";
            cout << "6. Rate per day\n";
            cout << "7. Availability\n";
            cout << "8. Cancel update & return to Admin Menu\n";
            cout << "Enter your choice: ";

            int opt;
            cin >> opt;

            // Validate input
            if (cin.fail()) {
                cin.clear();
                cin.ignore(1000, '\n');
                cout << "Invalid input. Please enter a number between 1 and 8.\n";
                continue;
            }

            cin.ignore(); // Clear buffer before getline

            switch (opt) {
                case 1: {
                    string newBrand;
                    cout << "Enter new brand: ";
                    getline(cin, newBrand);
                    cars[index].setBrand(newBrand);
                    cout << "Brand updated.\n";
                    break;
                }
                case 2: {
                    string newModel;
                    cout << "Enter new model: ";
                    getline(cin, newModel);
                    cars[index].setModel(newModel);
                    cout << "Model updated.\n";
                    break;
                }
                case 3: {
                    string newType;
                    cout << "Enter new Type (e.g. SUV, Sedan): ";
                    getline(cin, newType);
                    cars[index].setType(newType);
                    cout << "Type updated.\n";
                    break;
                }
                case 4: {
                    int newYear;
                    cout << "Enter new year: ";
                    cin >> newYear;
                    if (cin.fail()) {
                        cin.clear();
                        cin.ignore(1000, '\n');
                        cout << "Invalid year.\n";
                    } else {
                        cars[index].setYear(newYear);
                        cout << "Year updated.\n";
                    }
                    break;
                }
                case 5: {
                    int newCap;
                    cout << "Enter new capacity: ";
                    cin >> newCap;
                    if (cin.fail()) {
                        cin.clear();
                        cin.ignore(1000, '\n');
                        cout << "Invalid capacity.\n";
                    } else {
                        cars[index].setCapacity(newCap);
                        cout << "Capacity updated.\n";
                    }
                    break;
                    break;
                }
                case 6: {
                    double newRate;
                    cout << "Enter new rate per day: ";
                    cin >> newRate;
                    if (cin.fail()) {
                        cin.clear();
                        cin.ignore(1000, '\n');
                        cout << "Invalid rate.\n";
                    } else {
                        cars[index].setRatePerDay(newRate);
                        cout << "Rate updated.\n";
                    }
                    break;
                }
                case 7: {
                    string avail;
                    cout << "Is the car available? (yes/no): ";
                    cin >> avail;
                    bool isAvail = (avail == "yes" || avail == "Yes");
                    cars[index].setAvailability(isAvail);
                    cout << "Availability updated.\n";
                    break;
                }
                case 8: {
                    updating = false;
                    break;
                }
                default:
                cout << "invalid option.\n";
            }

            // Ask if admin wants to continue updating
            if (updating) {
                cout << "Do you want to continue updating? (y/n): ";
                char cont;
                cin >> cont;
                if (cont == 'n' || cont == 'N') {
                    updating = false;
                }
            }
        }

        saveCars();
        cout << "Car details updated successfully.\n";
    }


// Function: manageCustomerRecords
// Purpose: Allows Admin to update or delete existing customer records.
// Provides input validation, retry logic, and user-friendly prompts.
    void manageCustomerRecords() {
        int choice;
        bool validChoice = false;

        // Prompt until the user enters a valid menu option
        while (!validChoice) {
            cout << "\n customer Management \n";
            cout << "1. Update Customer\n";
            cout << "2. Delete Customer\n";
            cout << "Enter your choice: ";
            cin >> choice;

            // Input validation: Ensure choice is a number
            if (cin.fail()) {
                cin.clear();
                cin.ignore(1000, '\n');
                cout << "Invalid input. Please enter a number.\n";
                return; // Exit early if input is invalid

            } else if (choice == 1 || choice == 2) {
                validChoice = true;  // Valid input received 
            
            } else {
                cout << "Invalid choice. Please enter 1 or 2.\n";
            }
        }

        // Clear leftover newline before getline
        cin.ignore();
        string id;
        int index = -1;
        bool found = false;

        // Loop to repeatedly ask for a valid Customer ID
        while (!found) {
            cout << "Enter Customer ID: ";
            getline(cin, id);

            // Search for customer with matching ID
            index = -1;
            for (int i = 0; i < customers.size(); i++) {
                if (customers[i].getID() == id) {
                    index = i;
                    found = true;
                    break;
                }
            }
            
            // If customer is not found, offer option to try again or exit
            if (!found) {
                cout << "Customer not found.\n";
                char choice;
                cout << "Would you like to try again? (y/n): ";
                cin >> choice;
                cin.ignore(); // Clear buffer again

                if (choice != 'y' && choice != 'Y') {
                    cout << "Returning to Admin Menu.\n";
                    return; // Exit to admin menu
                }
            }
        }

        // If user chose to delete the customer
        if (choice == 2) {
            customers.erase(customers.begin() + index);
            cout << "Customer deleted successfully.\n";
            saveCustomers(); // Persist changes
            return;
        }

        // Update flow
        bool keepUpdating = true;
        while (keepUpdating) {
            cout << "\nUpdate Menu for Customer ID: " << id << endl;
            cout << "1. Update Name\n";
            cout << "2. Update License Number\n";
            cout << "3. Update Contact Info\n";
            cout << "4. Exit to Admin Menu\n";
            cout << "Enter your choice: ";

            int updateChoice;
            cin >> updateChoice;
            // Validate input
            if (cin.fail()) {
                cin.clear();
                cin.ignore(1000, '\n');
                cout << "Invalid input. Please enter a number between 1 and 4.\n";
                continue;
            }
            cin.ignore(); // Clear buffer before getline

            string newName, newLicense, newContact;

            // Handle selected update operation
            switch (updateChoice) {
                case 1:
                cout << "Enter new name: ";
                getline(cin, newName);
                customers[index].setName(newName);
                cout << "Name updated.\n";
                break;

                case 2:
                cout << "Enter new license number: ";
                getline(cin, newLicense);
                customers[index].setLicenseNumber(newLicense);
                cout << "License number updated.\n";
                break;

                case 3:
                cout << "Enter new contact info: ";
                getline(cin, newContact);
                customers[index].setContactInfo(newContact);
                cout << "Contact info updated.\n";
                break;

                case 4:
                keepUpdating = false; // Exit update menu
                break;

                default:
                cout << "Invalid choice.\n";
            }

            // Ask if user wants to continue updating
            if (keepUpdating) {
                char cont;
                cout << "Do you want to continue updating? (y/n): ";
                cin >> cont;
                cin.ignore();
                keepUpdating = (cont == 'y' || cont == 'Y');
            }
        }

        // Save updated customer list
        saveCustomers();
    }


// Function: manageBookingRecords
// Purpose: Allows Admin to update or delete existing booking records.
// Provides input validation, retry logic, and user-friendly prompts.
    void manageBookingRecords() {
        int choice;
        bool validChoice = false;

        // Prompt user for valid choice until correct input is received
        while (!validChoice) {
            cout << "\nBooking Management\n";
            cout << "1. Update Booking\n";
            cout << "2. Delete Booking\n";
            cout << "Enter your choice: ";
            cin >> choice;

            // Error handling for non-integer input
            if (cin.fail()) {
                cin.clear();
                cin.ignore(1000, '\n');
                cout << "Invalid input. Please enter a number.\n";
            } else if (choice == 1 || choice == 2) {
                validChoice = true;
            } else {
                cout << "Invalid choice. Please enter 1 or 2.\n";
            }
        }

        // Clear leftover newline before getline
        cin.ignore();
        string id;
        int index = -1;
        bool found = false;

        // Loop until valid Booking ID is entered or user exits
        while (!found) {
            cout << "Enter Booking ID: ";
            getline(cin, id);
            
            index = -1;
            for (int i = 0; i < bookings.size(); i++) {
                if (bookings[i].getBookingID() == id) {
                    index = i;
                    found = true;
                    break;
                }
            }

            if (!found) {
                cout << "Booking not found.\n";
                char retry;
                cout << "Would you like to try again? (y/n): ";
                cin >> retry;
                cin.ignore();  // clear input buffer
                if (retry != 'y' && retry != 'Y') {
                    cout << "Returning to Admin Menu.\n";
                    return;
                }
            }
        }

        // Handling booking deletion
        if (choice == 2) {
            string carID = bookings[index].getCarID();

            // Set related car as available again
            for (int i = 0; i < cars.size(); i++) {
                if (cars[i].getID() == carID) {
                    cars[i].setAvailability(1);  // 1 means available
                    break;
                }
            }

            bookings.erase(bookings.begin() + index);  // remove booking
            saveCars();
            saveBookings();
            cout << "Booking deleted successfully.\n";
            return;
        }

        // Begin update loop
        bool keepUpdating = true;
        while (keepUpdating) {
            cout << "\nUpdate Menu for Booking ID: " << id << endl;
            cout << "1. Update Customer ID\n";
            cout << "2. Update Car ID\n";
            cout << "3. Update Start Date\n";
            cout << "4. Update End Date\n";
            cout << "5. Exit to Admin Menu\n";
            cout << "Enter your choice: \n";

            int updateChoice;
            cin >> updateChoice;
            // Validate input
            if (cin.fail()) {
                cin.clear();
                cin.ignore(1000, '\n');
                cout << "Invalid input. Please enter a number between 1 and 5.\n";
                continue;
            }
            cin.ignore(); // Clear buffer before getline

            switch (updateChoice) {
                case 1: {
                    string newCustID;
                    cout << "Enter new Customer ID: ";
                    cin >> newCustID;
                    bookings[index].setCustomerID(newCustID);
                    cout << "Customer ID updated.\n";
                    break;
                }

                case 2: {
                    string newCarID;
                    cout << "Enter new Car ID: ";
                    cin >> newCarID;
                    bookings[index].setCarID(newCarID);
                    cout << "Car ID updated.\n";
                    break;
                }

                case 3: {
                    Date newStart;
                    cout << "Enter new Start Date: ";
                    cin >> newStart;
                    bookings[index].setStartDate(newStart);
                    cout << "Start Date updated.\n";
                    cin.ignore(); // Clear buffer
                    break;
                }

                case 4: {
                    Date newEnd;
                    cout << "Enter new End Date: ";
                    cin >> newEnd;
                    bookings[index].setEndDate(newEnd);
                    cout << "End Date updated.\n";
                    cin.ignore(); // Clear buffer
                    break;
                }

                case 5: {
                    keepUpdating = false;
                    break;
                }

                default:
                cout << "Invalid choice.\n";
            }
            
            if (keepUpdating) {
                char cont;
                cout << "Continue updating? (y/n): ";
                cin >> cont;
                cin.ignore();
                keepUpdating = (cont == 'y' || cont == 'Y');
            }
        }

        // Save changes after updates
        saveBookings();
    }


// Function: adminMenu
// Purpose: Displays the admin menu for managing cars, customers, and bookings. 
// Handles invalid choices and ensures that the user provides valid input.
    void adminMenu() {
        int choice;
        do {
            cout << "\n Admin Menu \n";
            cout << "1. View Cars\n";
            cout << "2. Add Cars\n";
            cout << "3. View Customers\n";
            cout << "4. Add Customers\n";
            cout << "5. View Bookings\n";
            cout << "6. Update Car Details\n";
            cout << "7. Manage Customer Records\n";
            cout << "8. Manage Booking Records\n";
            cout << "9. Exit to Main Menu\n";

            // Input validation loop for menu choice
            bool validChoice = false;
            while (!validChoice) {
                cout << "Choose an option: ";
                cin >> choice;

                // Check for invalid input (non-integer input)
                if (cin.fail()) {
                    cin.clear(); // Clear error flag
                    cin.ignore(1000, '\n'); // Ignore the invalid input
                    cout << "Invalid input! Please enter a number between 1 and 9.\n";
                } else if (choice >= 1 && choice <= 9) {
                    validChoice = true;
                } else {
                    cout << "Invalid choice! Please enter a number between 1 and 9.\n";
                }
            }

            // Process the user's valid choice
            switch (choice) {
                case 1: viewCars(); break;
                case 2: addCar(); break;
                case 3: viewCustomers(); break;
                case 4: addCustomer(); break;
                case 5: viewBookings(); break;
                case 6: updateCarDetails(); break;
                case 7: manageCustomerRecords(); break;
                case 8: manageBookingRecords(); break;
                case 9: break;
                default: cout << "Invalid choice! Try again.\n"; break;
            }
        } while (choice != 9);
        mainMenu();  //back to main menu after exiting the admin menu
    }


// Function: customerMenu
// Purpose: Displays the customer menu for viewing cars, booking a car, viewing previous bookings, 
// and returning to the main menu. Handles invalid choices and ensures the user provides valid input.
    void customerMenu() {
        int choice;
        do {
            cout << "\n Customer Menu \n";
            cout << "1. View Cars\n";
            cout << "2. Book a Car\n";
            cout << "3. View Previous Bookings\n";
            cout << "4. Exit to Main Menu\n";

            // Input validation loop for menu choice
            bool validChoice = false;
            while (!validChoice) {
                cout << "Choose an option: ";
                cin >> choice;

                // Check for invalid input
                if (cin.fail()) {
                    cin.clear(); 
                    cin.ignore(1000, '\n'); // Ignore the invalid input
                    cout << "Invalid input! Please enter a number between 1 and 4.\n";
                } else if (choice >= 1 && choice <= 4) {
                    validChoice = true; // Valid input
                } else {
                    cout << "Invalid choice! Please enter a number between 1 and 4.\n";
                }
            }

            switch (choice) {
                case 1: viewCars(); break;
                case 2: bookCar(); break;
                case 3:{
                    string customerID;
                    cout << "Enter your Customer ID: ";
                    cin >> customerID;
                    viewBookings(customerID); 
                    break;
                } 
                case 4: break;
                default: cout << "Invalid choice! Try again.\n"; break;
            }
        } while (choice != 4);  // Loop until the user selects the Exit option
        mainMenu();
    }
    

// Function: mainMenu
// Purpose: Displays the main menu, where the user selects their role (Admin or Customer).
// Admin users must input a password correctly before proceeding to the Admin menu.
// Customer users will be directed to the customer menu. Ensures valid role input.
    bool mainMenu() {
        while (true) {  //loop until user either suceeds or exits
            string role;
            cout << "Enter your role (Admin/Customer): ";
            cin >> role;

            // Check for invalid role input (cin.fail())
            if (cin.fail()) {
                cin.clear(); // Clear error flag
                cin.ignore(1000, '\n'); // Ignore the invalid input
                cout << "Invalid input! Please enter 'Admin' or 'Customer'.\n";
                continue;
            }
            
            // Handle valid admin role
            if (role == "Admin" || role == "admin") {
                string password;
                int attempts = 0;
                const int maxAttempts = 5;

                while (attempts < maxAttempts) {
                    cout << "Enter Admin Password: ";
                    cin >> password;

                    if (password == "admin123") {
                        adminMenu(); 
                        return true;

                    } else {
                        attempts++;
                        cout << "Incorrect password. Access denied.\n";
                        if (attempts < maxAttempts) {
                            cout << "You have " << maxAttempts - attempts << " attempt(s) left.\n";

                        } else {
                            cout << "You have exceeded the maximum number of attempts." << endl;
                            cout << "Exiting due to too many incorrect password attempts." << endl;
                            return false; // Exit after too many invalid attempts
                        }
                    }
                }
                
            } 
            // Handle valid customer role
            else if (role == "Customer" || role == "customer") {
                customerMenu();
                return true;
            } 
            // Handle invalid customer role
            else {
                cout << "Invalid role. Please enter either 'Admin' or 'Customer'.\n";
            }
        }

        return false; // Ensure all control paths return a value
    }

    public:
    void menu() {
        loadCars();
        loadCustomers();
        loadBookings();

        bool success = mainMenu();

        if (success) {
            saveCars();
            saveCustomers();
            saveBookings();
        }
    }
};


int main () {
    rentalSystem system;
    system.menu();
    return 0;
};