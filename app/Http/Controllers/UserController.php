<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index()
    {
        return Inertia::render('users/Index', [
            'users' => User::with('permissions', 'roles')->paginate(10),
            'allPermissions' => Permission::all(),
            'allRoles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|unique:users,email|email',
            'password' => 'required|min:8',
            'is_active' => 'boolean'
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'is_active' => 1
        ]);

        return back()->with('message', 'User created successfully!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'is_active' => 'required|boolean',
        ]);

        $user->update($validated);

        return back()->with('message', 'User updated successfully!');
    }

    public function changePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update(['password' => $request->password]);

        return back()->with('message', 'Password updated successfully!');
    }

    public function destroy(User $user)
    {
        $user->teams()->detach();
        $user->delete();

        return back()->with('message', 'User deleted successfully.');
    }

    public function assignPermissions(Request $request, User $user)
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $user->syncPermissions($request->permissions ?? []);

        return back()->with('message', 'Permissions updated successfully!');
    }

    public function notifications()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('notifications/Index', compact('notifications'));
    }

    public function assignRoles(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name',
        ]);
        $user->syncRoles($request->roles ?? []);
        return back()->with('message', 'Roles updated successfully!');
    }
}
