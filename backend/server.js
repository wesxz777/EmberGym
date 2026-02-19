import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, testConnection } from './db.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test database connection on startup
testConnection();

// ============= TRAINERS ROUTES =============

// Get all trainers with user info
app.get('/api/trainers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.trainer_id as id,
        t.user_id,
        COALESCE(u.first_name, '') as first_name,
        COALESCE(u.last_name, '') as last_name,
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as name,
        CASE 
          WHEN u.user_type = 'trainer' THEN 'Personal Trainer'
          ELSE 'Trainer'
        END as role,
        t.specialization,
        t.certification,
        t.experience_years,
        t.bio,
        COALESCE(u.profile_image, '') as image,
        t.rating,
        t.total_reviews,
        t.hourly_rate,
        t.created_at
      FROM trainers t
      LEFT JOIN users u ON t.user_id = u.user_id
      WHERE u.is_active = 1 OR u.is_active IS NULL
      ORDER BY t.trainer_id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
});

// Get single trainer by ID
app.get('/api/trainers/:id', async (req, res) => {
  try {
    const [trainerRows] = await pool.query(`
      SELECT 
        t.trainer_id as id,
        t.user_id,
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as name,
        u.email,
        u.phone,
        t.specialization,
        t.certification,
        t.experience_years,
        t.bio,
        COALESCE(u.profile_image, '') as image,
        t.rating,
        t.total_reviews,
        t.hourly_rate,
        t.created_at
      FROM trainers t
      LEFT JOIN users u ON t.user_id = u.user_id
      WHERE t.trainer_id = ?
    `, [req.params.id]);
    
    if (trainerRows.length === 0) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    // Get trainer's reviews
    const [reviews] = await pool.query(`
      SELECT 
        r.review_id,
        r.rating,
        r.review_text,
        CONCAT(u.first_name, ' ', u.last_name) as reviewer_name,
        r.created_at
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.trainer_id = ? AND r.is_approved = 1
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [req.params.id]);
    
    res.json({ ...trainerRows[0], reviews });
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).json({ error: 'Failed to fetch trainer' });
  }
});

// Create new trainer
app.post('/api/trainers', async (req, res) => {
  try {
    const {
      user_id,
      specialization,
      certification,
      experience_years,
      bio,
      rating,
      hourly_rate
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO trainers 
      (user_id, specialization, certification, experience_years, bio, rating, hourly_rate, total_reviews) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id || null,
        specialization || '',
        certification || '',
        experience_years || 0,
        bio || '',
        rating || 0,
        hourly_rate || 0,
        0
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Trainer created successfully' });
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ error: 'Failed to create trainer' });
  }
});

// Update trainer
app.put('/api/trainers/:id', async (req, res) => {
  try {
    const {
      user_id,
      specialization,
      certification,
      experience_years,
      bio,
      rating,
      hourly_rate,
      total_reviews
    } = req.body;

    await pool.query(
      `UPDATE trainers 
      SET user_id = ?, specialization = ?, certification = ?, 
          experience_years = ?, bio = ?, rating = ?, hourly_rate = ?, total_reviews = ?
      WHERE trainer_id = ?`,
      [
        user_id,
        specialization,
        certification,
        experience_years,
        bio,
        rating,
        hourly_rate,
        total_reviews,
        req.params.id
      ]
    );

    res.json({ message: 'Trainer updated successfully' });
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ error: 'Failed to update trainer' });
  }
});

// Delete trainer
app.delete('/api/trainers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM trainers WHERE trainer_id = ?', [req.params.id]);
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Failed to delete trainer' });
  }
});

// ============= CLASSES ROUTES =============

// Get all active classes
app.get('/api/classes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        class_id as id,
        class_name as name,
        class_type as type,
        description,
        duration_minutes,
        intensity,
        max_participants,
        image_url as image,
        is_active,
        created_at
      FROM classes
      WHERE is_active = 1
      ORDER BY class_name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get single class by ID
app.get('/api/classes/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        class_id as id,
        class_name as name,
        class_type as type,
        description,
        duration_minutes,
        intensity,
        max_participants,
        image_url as image,
        is_active,
        created_at
      FROM classes
      WHERE class_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// ============= SCHEDULES ROUTES =============

// Get all schedules with class and trainer info
app.get('/api/schedules', async (req, res) => {
  try {
    const { day, trainer_id, class_id } = req.query;
    
    let query = `
      SELECT 
        s.schedule_id as id,
        s.class_id,
        s.trainer_id,
        s.day_of_week,
        s.start_time,
        s.end_time,
        s.room_location,
        s.spots_available,
        c.class_name,
        c.class_type,
        c.duration_minutes,
        c.intensity,
        c.image_url as class_image,
        CONCAT(u.first_name, ' ', u.last_name) as trainer_name,
        u.profile_image as trainer_image
      FROM schedules s
      LEFT JOIN classes c ON s.class_id = c.class_id
      LEFT JOIN trainers t ON s.trainer_id = t.trainer_id
      LEFT JOIN users u ON t.user_id = u.user_id
      WHERE s.is_active = 1
    `;
    
    const params = [];
    if (day) {
      query += ' AND s.day_of_week = ?';
      params.push(day);
    }
    if (trainer_id) {
      query += ' AND s.trainer_id = ?';
      params.push(trainer_id);
    }
    if (class_id) {
      query += ' AND s.class_id = ?';
      params.push(class_id);
    }
    
    query += ' ORDER BY FIELD(s.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), s.start_time';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// ============= MEMBERSHIP PLANS ROUTES =============

// Get all active membership plans
app.get('/api/membership-plans', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        plan_id as id,
        plan_name as name,
        description,
        duration_days,
        price,
        features,
        is_active,
        created_at
      FROM membership_plans
      WHERE is_active = 1
      ORDER BY price ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    res.status(500).json({ error: 'Failed to fetch membership plans' });
  }
});

// ============= BOOKINGS ROUTES =============

// Get all bookings (with filters)
app.get('/api/bookings', async (req, res) => {
  try {
    const { user_id, schedule_id, status } = req.query;
    
    let query = `
      SELECT 
        b.booking_id as id,
        b.user_id,
        b.schedule_id,
        b.booking_date,
        b.status,
        b.checked_in,
        b.check_in_time,
        b.notes,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        c.class_name,
        s.day_of_week,
        s.start_time,
        s.end_time,
        CONCAT(ut.first_name, ' ', ut.last_name) as trainer_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.user_id
      LEFT JOIN schedules s ON b.schedule_id = s.schedule_id
      LEFT JOIN classes c ON s.class_id = c.class_id
      LEFT JOIN trainers t ON s.trainer_id = t.trainer_id
      LEFT JOIN users ut ON t.user_id = ut.user_id
      WHERE 1=1
    `;
    
    const params = [];
    if (user_id) {
      query += ' AND b.user_id = ?';
      params.push(user_id);
    }
    if (schedule_id) {
      query += ' AND b.schedule_id = ?';
      params.push(schedule_id);
    }
    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY b.booking_date DESC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { user_id, schedule_id, booking_date, notes } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, schedule_id, booking_date, status, notes) 
       VALUES (?, ?, ?, 'confirmed', ?)`,
      [user_id, schedule_id, booking_date, notes || null]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Booking created successfully' 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// ============= CONTACT REQUESTS ROUTES =============

// Get all contact requests
app.get('/api/contact-requests', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        request_id as id,
        full_name,
        email,
        phone,
        class_type,
        preferred_date,
        preferred_time,
        message,
        status,
        assigned_to,
        created_at,
        resolved_at
      FROM contact_requests
      WHERE 1=1
    `;
    
    const params = [];
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({ error: 'Failed to fetch contact requests' });
  }
});

// Create new contact request
app.post('/api/contact-requests', async (req, res) => {
  try {
    const { full_name, email, phone, class_type, preferred_date, preferred_time, message } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO contact_requests 
       (full_name, email, phone, class_type, preferred_date, preferred_time, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [full_name, email, phone || null, class_type || null, preferred_date || null, preferred_time || null, message]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Contact request submitted successfully' 
    });
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({ error: 'Failed to submit contact request' });
  }
});

// ============= REVIEWS ROUTES =============

// Get all approved reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const { trainer_id, class_id } = req.query;
    
    let query = `
      SELECT 
        r.review_id as id,
        r.user_id,
        r.class_id,
        r.trainer_id,
        r.rating,
        r.review_text,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        c.class_name,
        CONCAT(ut.first_name, ' ', ut.last_name) as trainer_name,
        r.created_at
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.user_id
      LEFT JOIN classes c ON r.class_id = c.class_id
      LEFT JOIN trainers t ON r.trainer_id = t.trainer_id
      LEFT JOIN users ut ON t.user_id = ut.user_id
      WHERE r.is_approved = 1
    `;
    
    const params = [];
    if (trainer_id) {
      query += ' AND r.trainer_id = ?';
      params.push(trainer_id);
    }
    if (class_id) {
      query += ' AND r.class_id = ?';
      params.push(class_id);
    }
    
    query += ' ORDER BY r.created_at DESC LIMIT 50';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// ============= STATISTICS ROUTES =============

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [trainersCount] = await pool.query('SELECT COUNT(*) as count FROM trainers');
    const [classesCount] = await pool.query('SELECT COUNT(*) as count FROM classes WHERE is_active = 1');
    const [membersCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE user_type = "member"');
    const [activeMembers] = await pool.query('SELECT COUNT(*) as count FROM user_memberships WHERE status = "active"');
    
    res.json({
      total_trainers: trainersCount[0].count,
      total_classes: classesCount[0].count,
      total_members: membersCount[0].count,
      active_memberships: activeMembers[0].count
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EmberGym API is running', database: 'embergym_db' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💾 Database: embergym_db`);
});
