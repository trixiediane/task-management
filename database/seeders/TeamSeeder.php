<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all user IDs to randomly assign as creators
        $userIds = User::pluck('id')->toArray();

        // If no users exist, create one default user
        if (empty($userIds)) {
            $defaultUser = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
            $userIds = [$defaultUser->id];
        }

        // Create 300 teams
        for ($i = 1; $i <= 5000; $i++) {
            $creatorId = $userIds[array_rand($userIds)];

            Team::create([
                'name' => 'Team ' . $i,
                'created_by' => $creatorId,
                'updated_by' => $creatorId,
            ]);
        }
    }
}
