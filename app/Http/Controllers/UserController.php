<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(10);
        return Inertia::render('users/Index', compact('users'));
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

        return redirect()->route('users.index')
            ->with('message', 'User created successfully!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'is_active' => 'required|boolean',
        ]);

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('message', 'User updated successfully!');
    }
    public function changePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => $validated['password']
        ]);

        return redirect()
            ->route('users.index')
            ->with('message', 'Password updated successfully!');
    }

    public function destroy(User $user)
    {
        // Detach user from all teams
        $user->teams()->detach();

        // Then delete the user
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('message', 'User deleted successfully.');
    }


    public function getPermissions(User $user)
    {
        $allPermissions = Permission::all();
        $userPermissions = $user->getAllPermissions()->pluck('name');

        return response()->json([
            'all_permissions' => $allPermissions,
            'user_permissions' => $userPermissions,
        ]);
    }

    public function assignPermissions(Request $request, User $user)
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $user->syncPermissions($request->permissions ?? []);

        return redirect()->route('users.index')
            ->with('message', 'Permissions updated successfully!');
    }
}
