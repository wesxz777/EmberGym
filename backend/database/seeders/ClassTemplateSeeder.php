<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClassTemplate;

class ClassTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            [
                'name' => 'Power Yoga Flow',
                'type' => 'Yoga',
                'duration' => 60,
                'intensity' => 'Medium',
                'description' => 'Dynamic vinyasa flow combining strength, flexibility, and mindfulness.',
                'image' => 'https://images.unsplash.com/photo-1651077837628-52b3247550ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBzdHVkaW98ZW58MXx8fHwxNzcwMjI2NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'benefits' => ['Increased flexibility', 'Stress relief', 'Core strength'],
                'allowed_plans' => ['Basic', 'Pro', 'Elite'],
            ],
            [
                'name' => 'HIIT Blast',
                'type' => 'HIIT',
                'duration' => 45,
                'intensity' => 'High',
                'description' => 'High-intensity interval training to maximize calorie burn and boost metabolism.',
                'image' => 'https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWl0JTIwdHJhaW5pbmclMjBpbnRlbnNlfGVufDF8fHx8MTc3MDIxMjg2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
                'benefits' => ['Fat burning', 'Cardiovascular health', 'Endurance'],
                'allowed_plans' => ['Pro', 'Elite'],
            ],
            [
                'name' => 'Strength Builder',
                'type' => 'Strength',
                'duration' => 60,
                'intensity' => 'High',
                'description' => 'Build lean muscle and increase overall strength with progressive resistance training.',
                'image' => 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMHRyYWluaW5nJTIwd2VpZ2h0bGlmdGluZ3xlbnwxfHx8fDE3NzAyNzE1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
                'benefits' => ['Muscle building', 'Bone density', 'Metabolism boost'],
                'allowed_plans' => ['Pro', 'Elite'],
            ],
            [
                'name' => 'Cardio Cycling',
                'type' => 'Cardio',
                'duration' => 45,
                'intensity' => 'Medium',
                'description' => 'High-energy cycling class with motivating music and inspiring instructors.',
                'image' => 'https://images.unsplash.com/photo-1761971976282-b2bb051a5474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBzcGlubmluZyUyMGN5Y2xpbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
                'benefits' => ['Cardiovascular fitness', 'Lower body strength', 'Calorie burn'],
                'allowed_plans' => ['Basic', 'Pro', 'Elite'],
            ],
            [
                'name' => 'Core Pilates',
                'type' => 'Pilates',
                'duration' => 50,
                'intensity' => 'Low',
                'description' => 'Focus on core strength, posture, and flexibility through controlled movements.',
                'image' => 'https://images.unsplash.com/photo-1754258167836-6878c54e316c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcwMjI2NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'benefits' => ['Core stability', 'Posture improvement', 'Mind-body connection'],
                'allowed_plans' => ['Basic', 'Pro', 'Elite'],
            ],
        ];

        foreach ($classes as $class) {
            ClassTemplate::create($class);
        }
    }
}