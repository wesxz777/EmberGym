# EmberGym API Endpoints

Base URL: `http://localhost:3001/api`

## Health Check

### GET `/health`
Check if API is running
```json
Response: {
  "status": "ok",
  "message": "EmberGym API is running",
  "database": "embergym_db"
}
```

## Statistics

### GET `/stats`
Get gym statistics
```json
Response: {
  "total_trainers": 0,
  "total_classes": 0,
  "total_members": 0,
  "active_memberships": 0
}
```

---

## Trainers

### GET `/trainers`
Get all trainers with user information
```json
Response: [{
  "id": 1,
  "user_id": 5,
  "first_name": "John",
  "last_name": "Doe",
  "name": "John Doe",
  "role": "Personal Trainer",
  "specialization": "Strength Training",
  "certification": "NASM-CPT",
  "experience_years": 5,
  "bio": "...",
  "image": "url",
  "rating": 4.5,
  "total_reviews": 10,
  "hourly_rate": 50.00,
  "created_at": "2024-01-01..."
}]
```

### GET `/trainers/:id`
Get single trainer with reviews
```json
Response: {
  "id": 1,
  "name": "John Doe",
  ...
  "reviews": [...]
}
```

### POST `/trainers`
Create new trainer
```json
Body: {
  "user_id": 5,
  "specialization": "Yoga",
  "certification": "RYT-500",
  "experience_years": 3,
  "bio": "...",
  "rating": 0,
  "hourly_rate": 40
}
```

### PUT `/trainers/:id`
Update trainer

### DELETE `/trainers/:id`
Delete trainer

---

## Classes

### GET `/classes`
Get all active classes
```json
Response: [{
  "id": 1,
  "name": "Morning Yoga",
  "type": "Yoga",
  "description": "...",
  "duration_minutes": 60,
  "intensity": "Low",
  "max_participants": 20,
  "image": "url",
  "is_active": 1,
  "created_at": "..."
}]
```

### GET `/classes/:id`
Get single class details

---

## Schedules

### GET `/schedules`
Get all schedules with class and trainer info

**Query Parameters:**
- `day` - Filter by day of week (e.g., "Monday")
- `trainer_id` - Filter by trainer ID
- `class_id` - Filter by class ID

```json
Response: [{
  "id": 1,
  "class_id": 3,
  "trainer_id": 2,
  "day_of_week": "Monday",
  "start_time": "08:00:00",
  "end_time": "09:00:00",
  "room_location": "Studio A",
  "spots_available": 15,
  "class_name": "Morning Yoga",
  "class_type": "Yoga",
  "duration_minutes": 60,
  "intensity": "Low",
  "class_image": "url",
  "trainer_name": "Sarah Johnson",
  "trainer_image": "url"
}]
```

---

## Membership Plans

### GET `/membership-plans`
Get all active membership plans
```json
Response: [{
  "id": 1,
  "name": "Monthly Basic",
  "description": "...",
  "duration_days": 30,
  "price": 49.99,
  "features": "...",
  "is_active": 1,
  "created_at": "..."
}]
```

---

## Bookings

### GET `/bookings`
Get all bookings

**Query Parameters:**
- `user_id` - Filter by user ID
- `schedule_id` - Filter by schedule ID
- `status` - Filter by status (confirmed, cancelled, completed)

```json
Response: [{
  "id": 1,
  "user_id": 10,
  "schedule_id": 5,
  "booking_date": "2024-02-20",
  "status": "confirmed",
  "checked_in": 0,
  "check_in_time": null,
  "notes": "",
  "user_name": "Jane Smith",
  "class_name": "HIIT Training",
  "day_of_week": "Monday",
  "start_time": "18:00:00",
  "end_time": "19:00:00",
  "trainer_name": "Mike Chen"
}]
```

### POST `/bookings`
Create new booking
```json
Body: {
  "user_id": 10,
  "schedule_id": 5,
  "booking_date": "2024-02-20",
  "notes": "First time"
}
```

---

## Contact Requests

### GET `/contact-requests`
Get all contact requests

**Query Parameters:**
- `status` - Filter by status (new, contacted, resolved, spam)

```json
Response: [{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "class_type": "Yoga",
  "preferred_date": "2024-02-20",
  "preferred_time": "18:00:00",
  "message": "Interested in joining",
  "status": "new",
  "assigned_to": null,
  "created_at": "...",
  "resolved_at": null
}]
```

### POST `/contact-requests`
Create new contact request
```json
Body: {
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "class_type": "Yoga",
  "preferred_date": "2024-02-20",
  "preferred_time": "18:00",
  "message": "I would like to join"
}
```

---

## Reviews

### GET `/reviews`
Get all approved reviews

**Query Parameters:**
- `trainer_id` - Filter by trainer ID
- `class_id` - Filter by class ID

```json
Response: [{
  "id": 1,
  "user_id": 10,
  "class_id": 3,
  "trainer_id": 2,
  "rating": 5,
  "review_text": "Great class!",
  "user_name": "Jane Smith",
  "class_name": "Yoga",
  "trainer_name": "Sarah Johnson",
  "created_at": "..."
}]
```

---

## Testing Examples

### Using PowerShell

```powershell
# Get all trainers
Invoke-RestMethod -Uri "http://localhost:3001/api/trainers" | ConvertTo-Json

# Get statistics
Invoke-RestMethod -Uri "http://localhost:3001/api/stats"

# Get schedules for Monday
Invoke-RestMethod -Uri "http://localhost:3001/api/schedules?day=Monday"

# Create contact request
$body = @{
    full_name = "Test User"
    email = "test@example.com"
    message = "Interested in membership"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/contact-requests" -Method POST -Body $body -ContentType "application/json"
```

### Using curl

```bash
# Get all classes
curl http://localhost:3001/api/classes

# Get membership plans
curl http://localhost:3001/api/membership-plans

# Create booking
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "schedule_id": 5, "booking_date": "2024-02-20"}'
```
