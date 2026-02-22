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
        Role::create(['name' => 'Project Manager']);
        Role::create(['name' => 'Member']);

        // Optional: Create permissions
        Permission::create(['name' => 'view team']);
        Permission::create(['name' => 'create team']);
        Permission::create(['name' => 'update team']);
        Permission::create(['name' => 'delete team']);
        Permission::create(['name' => 'assign users']);
        Permission::create(['name' => 'assign permissions']);

        Permission::create(['name' => 'view user']);
        Permission::create(['name' => 'create user']);
        Permission::create(['name' => 'update user']);
        Permission::create(['name' => 'delete user']);
        Permission::create(['name' => 'change password']);

        Permission::create(['name' => 'view project']);
        Permission::create(['name' => 'create project']);
        Permission::create(['name' => 'update project']);
        Permission::create(['name' => 'delete project']);
    }
}
