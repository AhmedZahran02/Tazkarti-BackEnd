# **Tazkarti Backend**  

## **Project Overview**  
Tazkarti is a backend service for managing ticket reservations, matches, and user authentication for a sports event booking system. Built using **Node.js**, **Express**, and **MongoDB**, it offers a secure and scalable API for creating and managing events, matches, seating arrangements, and ticket reservations.  

---

## **Key Features**  
- **User Authentication & Management:**  
  - Secure registration, login, and user role management with JWT authentication.  
  - Admin-only user approval and removal.  

- **Match Management:**  
  - Create, edit, and fetch match details.  
  - Manage match venues and referees.  

- **Ticket Management:**  
  - Reserve, fetch, and manage seating for matches.  

- **Seating Management:**  
  - Get seating layouts for matches.  

---

## **Technologies Used**  
- **Node.js**  
- **Express.js**  
- **MongoDB**  
- **Mongoose ORM**  
- **JWT (JSON Web Tokens)**  

---

## **Folder Structure**  
```
Tazkarti-BackEnd/
├── controllers/        # Handle business logic for routes
├── models/             # Define database schemas
├── routes/             # Define API routes for matches, tickets, and authentication
├── middlewares/        # Custom middleware (e.g., authentication)
├── utils/              # Utility functions (JWT authorization)
├── app.js              # Application entry point
└── package.json        # Project metadata and dependencies
```

---

## **Database Models**  

### **Match Schema**  
- `homeTeam`: Reference to the **Teams** collection  
- `awayTeam`: Reference to the **Teams** collection, validated to be different from `homeTeam`  
- `matchVenue`: Reference to the **Stadiums** collection  
- `date`: Match date  
- `time`: Match time  
- `mainReferee`, `firstLinesman`, `secondLinesman`: Reference to **Referees**  

### **Ticket Schema**  
- `seatId`: Reference to the **Seats** collection  
- `matchId`: Reference to the **Match** collection  
- `userId`: Reference to the **Users** collection  

---

## **Getting Started**  

### **Prerequisites**  
- Node.js  
- MongoDB  

### **Setup**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/AhmedZahran02/Tazkarti-BackEnd.git
   cd Tazkarti-BackEnd
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment variables in a `.env` file:  
   ```
   PORT=5000  
   MONGO_URI=your_mongo_db_uri  
   JWT_SECRET=your_jwt_secret  
   ```

4. Start the server:  
   ```bash
   npm start
   ```

---

## **API Endpoints**  

### **Authentication Routes (`/auth`)**  
- `GET /auth/` - Welcome to the Auth API  
- `POST /auth/register` - Register a new user  
- `POST /auth/login` - User login  
- `PATCH /auth/activate/:username` - Activate a user (Admin-only)  
- `DELETE /auth/remove/:username` - Remove a user  
- `GET /auth/cities` - Fetch available cities  

### **Match Routes (`/matches`)**  
- `POST /matches/create` - Create a new match  
- `PATCH /matches/edit` - Edit a match  
- `GET /matches/` - Get all matches  
- `GET /matches/:matchId` - Get details for a specific match  
- `GET /matches/get-seats/:matchId` - Fetch seating layout for a match  

---

## **Future Enhancements**  
- Real-time notifications for ticket updates  
- Advanced seating management with seat selection  
- Payment gateway integration  
- Role-based access control for organizers  

---

## **Contributions**  
Contributions are welcome! Please submit a pull request or open an issue for any suggestions.  
