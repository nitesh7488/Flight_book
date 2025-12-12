# Flight Booking Application

A full-stack flight booking application built with React (frontend) and Node.js/Express (backend), featuring user authentication, flight search, booking management, and a PostgreSQL database managed by Prisma.

## Features

- **User Authentication**: Sign up, login, and JWT-based authentication.
- **Flight Search**: Search flights by origin, destination, and date.
- **Booking Management**: Book flights, view booking history, and manage reservations.
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS.
- **Real-time Data**: Dynamic flight data seeded for 4 months across multiple Indian cities and airlines.
- **Admin Features**: (If applicable, extendable for admin roles).

## Tech Stack

### Frontend
- **React** (v18) with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Framer Motion** for animations
- **React Icons** and **Lucide React** for icons

### Backend
- **Node.js** with Express and TypeScript
- **Prisma** ORM with PostgreSQL database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Database
- **PostgreSQL**
- **Prisma** for schema management and migrations

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - For cloning the repository

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nitesh7488/Flight_book.git
   cd FlightBooker
   ```

2. **Set up the Backend**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/flightbooker?schema=public"
     JWT_SECRET="your-super-secret-jwt-key"
     PORT=4000
     ```
     - Replace `username`, `password`, and other placeholders with your PostgreSQL credentials.
     - Ensure PostgreSQL is running and the database `flightbooker` exists (or create it).

3. **Set up the Frontend**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `frontend` directory (optional, for custom API URL):
     ```
     VITE_API=http://localhost:4000
     ```

## Database Setup

1. **Run Prisma Migrations**:
   - From the `backend` directory:
     ```bash
     npx prisma migrate dev --name init
     ```
     This will create the database schema based on `prisma/schema.prisma`.

2. **Seed the Database**:
   - Run the seeding script to populate the database with sample flight data:
     ```bash
     npm run prisma:seed
     ```
     - This generates approximately 100,000+ flights across 120 days (4 months) for various Indian cities (e.g., Delhi, Mumbai, Bangalore) and airlines (IndiGo, Air India, Vistara, etc.).
     - Seeding includes random departure times, durations, and prices.

3. **Generate Prisma Client** (if not done automatically):
   ```bash
   npx prisma generate
   ```

## Running the Application

1. **Start the Backend**:
   - From the `backend` directory:
     ```bash
     npm run dev
     ```
     - The server will run on `http://localhost:4000` (or the port specified in `.env`).

2. **Start the Frontend**:
   - From the `frontend` directory:
     ```bash
     npm run dev
     ```
     - The frontend will run on `http://localhost:5173` (default Vite port).

3. **Access the Application**:
   - Open your browser and go to `http://localhost:5173`.
   - Sign up for a new account or log in.
   - Search for flights, view details, and make bookings.

## API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Flights
- `GET /flights/search?fromCity=X&toCity=Y&date=Z` - Search flights
- `GET /flights/:id` - Get flight details

### Bookings
- `POST /booking` - Create a booking (requires auth)
- `GET /booking/history` - Get user's booking history (requires auth)
- `DELETE /booking/:id` - Cancel a booking (requires auth)

All authenticated endpoints require a JWT token in the `Authorization` header: `Bearer <token>`.

## Project Structure

```
FlightBooker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── index.ts
│   │   ├── prismaClient.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   └── routes/
│   │       ├── authRoutes.ts
│   │       ├── flightRoutes.ts
│   │       └── bookingRoutes.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   │   └── airlines/ (logo images)
│   ├── src/
│   │   ├── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── FlightCard.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── SearchPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   ├── FlightDetailsPage.tsx
│   │   │   ├── BookingSuccessPage.tsx
│   │   │   ├── BookingHistoryPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── flightSlice.ts
│   │   │   ├── bookingSlice.ts
│   │   │   └── hooks.ts
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for JWT token signing.
- `PORT`: Server port (default: 4000).

### Frontend (.env)
- `VITE_API`: Backend API base URL (default: http://localhost:4000).

## Scripts

### Backend
- `npm run dev`: Start development server with hot reload.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run prisma:seed`: Seed the database.

### Frontend
- `npm run dev`: Start Vite development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License.

## 💬 Support

If you have any issues, suggestions, or questions, feel free to reach out.

📌 **GitHub Issues:** Open an issue in this repository  
🔗 **LinkedIn:** [Nitesh Kumar](https://www.linkedin.com/in/nitesh-kumar654/)  
📱 **WhatsApp:** +91 910261534

