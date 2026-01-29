<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with([
            'createdBy:id,name',
            'users:id'
        ])
            ->select('id', 'name', 'created_by', 'updated_at')
            ->latest()
            ->paginate(10);

        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('teams/Index', compact('teams', 'users'));
    }

    public function getTeamUsers(Team $team)
    {
        $assignedUserIds = $team->users()->pluck('users.id')->toArray();

        $availableUsers = User::where(function ($query) use ($team) {
            // Users walang team at all
            $query->whereDoesntHave('teams')
                // OR users na nasa THIS team lang (not in any other team)
                ->orWhere(function ($q) use ($team) {
                    $q->whereHas('teams', function ($teamQuery) use ($team) {
                        $teamQuery->where('teams.id', $team->id);
                    })
                        // AND wala sa ibang team
                        ->whereDoesntHave('teams', function ($otherTeams) use ($team) {
                            $otherTeams->where('teams.id', '!=', $team->id);
                        });
                });
        })
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->paginate(20);

        return response()->json([
            'assignedUserIds' => $assignedUserIds,
            'users' => $availableUsers
        ]);
    }

    public function create()
    {
        return Inertia::render('teams/Create', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        Team::create([
            'name' => $validated['name'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id()
        ]);

        return redirect()->route('teams.index')
            ->with('message', 'Team created successfully!');
    }

    public function edit(Team $team)
    {
        return Inertia::render('teams/Edit', compact('team'));
    }

    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $team->update([
            'name' => $validated['name'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id()
        ]);

        return redirect()->route('teams.index')
            ->with('message', 'Team updated successfully!');
    }

    public function assignUsers(Request $request)
    {
        $validated = $request->validate([
            'teamId' => 'required|exists:teams,id',
            'selectedUsers' => 'array',
            'selectedUsers.*' => 'exists:users,id'
        ]);

        $team = Team::findOrFail($validated['teamId']);
        $team->users()->sync($validated['selectedUsers'] ?? []);

        return redirect()->route('teams.index')
            ->with('message', 'Team members have been updated!');
    }

    public function destroy(Team $team)
    {
        $team->users()->detach();

        $team->delete();

        return redirect()->route('teams.index')
            ->with('message', 'Team deleted successfully.');
    }
}
