<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        Role::create(['name' => 'team_owner']);
        Role::create(['name' => 'team_member']);

        // Optional: Create permissions
        Permission::create(['name' => 'manage team']);
        Permission::create(['name' => 'create project']);
        Permission::create(['name' => 'manage tasks']);
        Permission::create(['name' => 'assign tasks']);
    }
}
