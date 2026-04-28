<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClassTemplate;
use App\Models\GymClass;
use App\Models\User;
use Carbon\Carbon;

class FixedGymSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a default trainer if none exists
        GymClass::query()->delete();
        $trainer = User::firstOrCreate(
                ['email' => 'trainer@embergym.com'],
            [
                'first_name' => 'Lead',
                'last_name' => 'Trainer',
                'role' => 'trainer',
                'phone' => '09123456789',
                'password' => bcrypt('password')
            ]
        );

        // 2. The Catalogue (Your Classes)
        $templates = [
            'Power Yoga Flow' => ClassTemplate::firstOrCreate(['name' => 'Power Yoga Flow'], ['type' => 'Yoga', 'duration' => 60, 'intensity' => 'Medium', 'description' => 'Dynamic vinyasa flow combining strength, flexibility, and mindfulness.', 'image' => 'https://images.unsplash.com/photo-1651077837628-52b3247550ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBzdHVkaW98ZW58MXx8fHwxNzcwMjI2NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080']),
            'HIIT Blast' => ClassTemplate::firstOrCreate(['name' => 'HIIT Blast'], ['type' => 'HIIT', 'duration' => 45, 'intensity' => 'High', 'description' => 'High-intensity interval training to maximize calorie burn.', 'image' => 'https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWl0JTIwdHJhaW5pbmclMjBpbnRlbnNlfGVufDF8fHx8MTc3MDIxMjg2M3ww&ixlib=rb-4.1.0&q=80&w=1080']),
            'Strength Builder' => ClassTemplate::firstOrCreate(['name' => 'Strength Builder'], ['type' => 'Strength', 'duration' => 60, 'intensity' => 'High', 'description' => 'Build lean muscle and increase overall strength.', 'image' => 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMHRyYWluaW5nJTIwd2VpZ2h0bGlmdGluZ3xlbnwxfHx8fDE3NzAyNzE1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080']),
            'Cardio Cycling' => ClassTemplate::firstOrCreate(['name' => 'Cardio Cycling'], ['type' => 'Cardio', 'duration' => 45, 'intensity' => 'Medium', 'description' => 'High-energy cycling class with motivating music.', 'image' => 'https://images.unsplash.com/photo-1761971976282-b2bb051a5474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBzcGlubmluZyUyMGN5Y2xpbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080']),
            'Core Pilates' => ClassTemplate::firstOrCreate(['name' => 'Core Pilates'], ['type' => 'Pilates', 'duration' => 50, 'intensity' => 'Low', 'description' => 'Focus on core strength, posture, and flexibility.', 'image' => 'https://images.unsplash.com/photo-1754258167836-6878c54e316c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcwMjI2NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080']),
            'Boxing Cardio' => ClassTemplate::firstOrCreate(['name' => 'Boxing Cardio'], ['type' => 'Cardio', 'duration' => 55, 'intensity' => 'High', 'description' => 'Learn boxing techniques for a full-body workout.', 'image' => 'https://images.unsplash.com/photo-1734191797121-de71b48ba038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3hpbmclMjBmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080']),
            'CrossFit WOD' => ClassTemplate::firstOrCreate(['name' => 'CrossFit WOD'], ['type' => 'HIIT', 'duration' => 60, 'intensity' => 'High', 'description' => 'Functional movements performed at high intensity.', 'image' => 'https://images.unsplash.com/photo-1467818488384-3a21f2b79959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2ZpdCUyMHdvcmtvdXR8ZW58MXx8fHwxNzcwMjcxNTExfDA&ixlib=rb-4.1.0&q=80&w=1080']),
            'Zumba Dance Party' => ClassTemplate::firstOrCreate(['name' => 'Zumba Dance Party'], ['type' => 'Cardio', 'duration' => 45, 'intensity' => 'Medium', 'description' => 'Dance-based cardio workout.', 'image' => 'https://images.unsplash.com/photo-1759375201813-572504b6ba9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6dW1iYSUyMGRhbmNlJTIwZml0bmVzc3xlbnwxfHx8fDE3NzAyNzE1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080']),
        ];

        // 3. Helper to map "Monday" to a real date this week
        $startOfWeek = Carbon::now()->startOfWeek();
        $daysMap = [
            'Monday' => $startOfWeek->copy(),
            'Tuesday' => $startOfWeek->copy()->addDays(1),
            'Wednesday' => $startOfWeek->copy()->addDays(2),
            'Thursday' => $startOfWeek->copy()->addDays(3),
            'Friday' => $startOfWeek->copy()->addDays(4),
            'Saturday' => $startOfWeek->copy()->addDays(5),
            'Sunday' => $startOfWeek->copy()->addDays(6),
        ];

        // 4. Your exact 30-item schedule
        $schedule = [
            ['name' => 'Power Yoga Flow', 'time' => '06:00', 'day' => 'Monday', 'room' => 'Studio A', 'capacity' => 20],
            ['name' => 'HIIT Blast', 'time' => '09:00', 'day' => 'Monday', 'room' => 'Fitness Floor', 'capacity' => 15],
            ['name' => 'Cardio Cycling', 'time' => '12:00', 'day' => 'Monday', 'room' => 'Cycling Studio', 'capacity' => 25],
            ['name' => 'Strength Builder', 'time' => '17:00', 'day' => 'Monday', 'room' => 'Weight Room', 'capacity' => 12],
            ['name' => 'Core Pilates', 'time' => '19:00', 'day' => 'Monday', 'room' => 'Studio B', 'capacity' => 15],
            
            ['name' => 'Boxing Cardio', 'time' => '06:30', 'day' => 'Tuesday', 'room' => 'Studio A', 'capacity' => 18],
            ['name' => 'Power Yoga Flow', 'time' => '10:00', 'day' => 'Tuesday', 'room' => 'Studio B', 'capacity' => 20],
            ['name' => 'CrossFit WOD', 'time' => '12:30', 'day' => 'Tuesday', 'room' => 'Fitness Floor', 'capacity' => 12],
            ['name' => 'Zumba Dance Party', 'time' => '18:00', 'day' => 'Tuesday', 'room' => 'Studio A', 'capacity' => 30],
            ['name' => 'Strength Builder', 'time' => '20:00', 'day' => 'Tuesday', 'room' => 'Weight Room', 'capacity' => 12],

            ['name' => 'HIIT Blast', 'time' => '06:00', 'day' => 'Wednesday', 'room' => 'Fitness Floor', 'capacity' => 15],
            ['name' => 'Core Pilates', 'time' => '09:30', 'day' => 'Wednesday', 'room' => 'Studio B', 'capacity' => 15],
            ['name' => 'Cardio Cycling', 'time' => '12:00', 'day' => 'Wednesday', 'room' => 'Cycling Studio', 'capacity' => 25],
            ['name' => 'Boxing Cardio', 'time' => '17:30', 'day' => 'Wednesday', 'room' => 'Studio A', 'capacity' => 18],
            ['name' => 'Power Yoga Flow', 'time' => '19:00', 'day' => 'Wednesday', 'room' => 'Studio B', 'capacity' => 20],

            ['name' => 'CrossFit WOD', 'time' => '06:30', 'day' => 'Thursday', 'room' => 'Fitness Floor', 'capacity' => 12],
            ['name' => 'Zumba Dance Party', 'time' => '10:00', 'day' => 'Thursday', 'room' => 'Studio A', 'capacity' => 30],
            ['name' => 'Strength Builder', 'time' => '12:30', 'day' => 'Thursday', 'room' => 'Weight Room', 'capacity' => 12],
            ['name' => 'Core Pilates', 'time' => '17:00', 'day' => 'Thursday', 'room' => 'Studio B', 'capacity' => 15],
            ['name' => 'HIIT Blast', 'time' => '19:30', 'day' => 'Thursday', 'room' => 'Fitness Floor', 'capacity' => 15],

            ['name' => 'Power Yoga Flow', 'time' => '06:00', 'day' => 'Friday', 'room' => 'Studio A', 'capacity' => 20],
            ['name' => 'Cardio Cycling', 'time' => '09:00', 'day' => 'Friday', 'room' => 'Cycling Studio', 'capacity' => 25],
            ['name' => 'Boxing Cardio', 'time' => '12:00', 'day' => 'Friday', 'room' => 'Studio A', 'capacity' => 18],
            ['name' => 'CrossFit WOD', 'time' => '17:00', 'day' => 'Friday', 'room' => 'Fitness Floor', 'capacity' => 12],
            ['name' => 'Zumba Dance Party', 'time' => '19:00', 'day' => 'Friday', 'room' => 'Studio A', 'capacity' => 30],

            ['name' => 'HIIT Blast', 'time' => '08:00', 'day' => 'Saturday', 'room' => 'Fitness Floor', 'capacity' => 15],
            ['name' => 'Power Yoga Flow', 'time' => '10:00', 'day' => 'Saturday', 'room' => 'Studio B', 'capacity' => 20],
            ['name' => 'Strength Builder', 'time' => '12:00', 'day' => 'Saturday', 'room' => 'Weight Room', 'capacity' => 12],

            ['name' => 'Core Pilates', 'time' => '09:00', 'day' => 'Sunday', 'room' => 'Studio B', 'capacity' => 15],
            ['name' => 'Cardio Cycling', 'time' => '11:00', 'day' => 'Sunday', 'room' => 'Cycling Studio', 'capacity' => 25],
        ];

        // 5. Inject into the database!
       // 5. Inject into the database!
        foreach ($schedule as $slot) {
            $date = $daysMap[$slot['day']]->format('Y-m-d');
            $endTime = Carbon::parse($slot['time'])->addMinutes($templates[$slot['name']]->duration)->format('H:i');

            GymClass::create([
                'name' => $slot['name'],
                'class_template_id' => $templates[$slot['name']]->id,
                'trainer_id' => $trainer->id,
                'room' => $slot['room'],
                'class_date' => $date,
                'start_time' => $slot['time'],
                'end_time' => $endTime,
                'max_capacity' => 25, // 🔥 STRICTLY ENFORCE 25 FOR ALL SEEDED CLASSES
            ]);
        }
    }
}