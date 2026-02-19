import { pool } from './db.js';

async function seed() {
  try {
    const rows = [
      [
        'Before Placeholder',
        'Before placeholder image stored in public',
        '/images/received_1393216615124102.svg',
        1
      ],
      [
        'After Placeholder',
        'After placeholder image stored in public',
        '/images/IMG_20251213_050239.svg',
        1
      ],
      [
        'Gym Equipment',
        'State-of-the-art equipment',
        'https://images.unsplash.com/photo-1676109829011-a9f0f3e40f00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        1
      ],
      [
        'Yoga Studio',
        'Peaceful yoga studio',
        'https://images.unsplash.com/photo-1642645550550-c2a442d17e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        1
      ]
    ];

    for (const r of rows) {
      await pool.query(
        `INSERT INTO gallery_images (title, description, image_url, is_active) VALUES (?, ?, ?, ?)`,
        r
      );
    }

    console.log('Seeded gallery_images successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed gallery:', err);
    process.exit(1);
  }
}

seed();
