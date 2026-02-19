-- Gallery table for storing image metadata
CREATE TABLE IF NOT EXISTS gallery_images (
  gallery_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT '' NOT NULL,
  description TEXT DEFAULT NULL,
  image_url VARCHAR(1000) NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample seed rows (uncomment to insert)
-- INSERT INTO gallery_images (title, description, image_url) VALUES
-- ('Studio Overview', 'Main studio area', 'https://example.com/images/studio1.jpg'),
-- ('Equipment', 'Racks and weights', 'https://example.com/images/equipment1.jpg');
