# EmberGym Backend API

Backend server for EmberGym with MySQL database integration.

## Prerequisites

- Node.js (v18 or higher)
- XAMPP with MySQL running
- MySQL server running on port 3306

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database

1. Start XAMPP and make sure MySQL is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the database schema:
   - Click "New" to create a database named `embergym`
   - Or run the SQL commands from `database-schema.sql`

```bash
# From phpMyAdmin SQL tab, run:
CREATE DATABASE IF NOT EXISTS embergym;
USE embergym;
```

Then copy and paste the contents of `database-schema.sql` into the SQL tab.

### 3. Environment Configuration

The `.env` file is already configured with XAMPP defaults:
- Host: localhost
- User: root
- Password: (empty)
- Database: embergym
- Port: 3306

If your XAMPP MySQL has different credentials, update the `.env` file.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on http://localhost:3001

### 5. Test the API

Visit http://localhost:3001/api/health to verify the server is running.

## API Endpoints

### Trainers

- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get single trainer by ID
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Example: Create a Trainer

```bash
POST http://localhost:3001/api/trainers
Content-Type: application/json

{
  "name": "John Doe",
  "role": "Personal Trainer",
  "specialties": ["Weight Training", "Nutrition"],
  "certifications": ["NASM-CPT"],
  "experience": "5 years",
  "bio": "Experienced trainer specializing in strength training.",
  "image": "https://example.com/image.jpg",
  "rating": 4.5,
  "clients": 100
}
```

## Database Schema

### trainers table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Auto-increment primary key |
| name | VARCHAR(255) | Trainer's full name |
| role | VARCHAR(255) | Job title/role |
| specialties | JSON | Array of specialties |
| certifications | JSON | Array of certifications |
| experience | VARCHAR(100) | Years of experience |
| bio | TEXT | Biography |
| image | TEXT | Profile image URL |
| rating | DECIMAL(2,1) | Rating out of 5 |
| clients | INT | Number of clients trained |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## Troubleshooting

### Connection Refused
- Make sure XAMPP MySQL is running
- Check that port 3306 is not blocked
- Verify MySQL credentials in `.env`

### Database Not Found
- Create the database using phpMyAdmin or MySQL command line
- Run the SQL commands from `database-schema.sql`

### CORS Issues
- The server has CORS enabled for all origins
- Frontend should be able to connect from http://localhost:5173

## Frontend Integration

The frontend Trainers page is already configured to:
- Fetch trainers from `http://localhost:3001/api/trainers`
- Display a loading state while fetching
- Show an empty state when no trainers exist
- Display error messages if the server is unreachable
