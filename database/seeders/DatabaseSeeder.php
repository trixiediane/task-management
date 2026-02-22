<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the RoleSeeder here
        $this->call([
            RoleSeeder::class,
            // TeamSeeder::class
        ]);

        // User::factory(count: 10000)->create();

        $user = User::create([
            'name' => 'Diane',
            'email' => 'diane@test.com',
            'password' => 'test123'
        ]);

        $user->assignRole('Project Manager');
        $user->givePermissionTo(Permission::all());
    }
}
