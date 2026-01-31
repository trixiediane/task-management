<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['owner:id,name', 'team:id,name'])
            ->orderBy('start_date', 'desc')
            ->paginate(10);

        $teams = Team::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('projects/Index', [
            'projects' => $projects,
            'teams' => $teams
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id'     => 'required|exists:teams,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:planning,ongoing,on_hold,completed,cancelled',
            'start_date'  => 'nullable|date',
            'due_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        Project::create([
            'team_id'     => $validated['team_id'],
            'owner_id'    => auth()->id(),
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'] ?? 'planning',
            'start_date'  => $validated['start_date'] ?? null,
            'due_date'    => $validated['due_date'] ?? null,
        ]);

        return redirect()
            ->route('projects.index')
            ->with('message', 'Project created successfully!');
    }
}
