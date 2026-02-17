-- Create EmberGym database
CREATE DATABASE IF NOT EXISTS embergym;
USE embergym;

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  specialties JSON,
  certifications JSON,
  experience VARCHAR(100),
  bio TEXT,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  clients INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: Insert sample data (you can remove these after testing)
-- INSERT INTO trainers (name, role, specialties, certifications, experience, bio, image, rating, clients) 
-- VALUES 
-- ('Sarah Johnson', 'Yoga & Mindfulness Specialist', 
--  JSON_ARRAY('Vinyasa Yoga', 'Power Yoga', 'Meditation', 'Flexibility'),
--  JSON_ARRAY('RYT-500', 'Mindfulness Coach', 'Nutrition Cert'),
--  '8 years',
--  'Sarah brings a holistic approach to fitness, combining traditional yoga practices with modern strength training techniques.',
--  'https://images.unsplash.com/photo-1667890786022-83bca6c4f4c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMHdvbWFufGVufDF8fHx8MTc3MDI3MTYxNXww&ixlib=rb-4.1.0&q=80&w=1080',
--  4.9, 150);
