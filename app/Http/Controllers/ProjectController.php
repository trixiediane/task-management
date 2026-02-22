<?php

namespace App\Http\Controllers;

use App\Events\UserNotification;
use App\Models\Notification;
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
            ->paginate(perPage: 3);

        $teams = Team::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('projects/Index', [
            'projects' => $projects,
            'teams' => $teams
        ]);
    }

    private function notifyTeamMembers(int $teamId, string $title, string $message, string $type = 'info'): void
    {
        $team = Team::with('users')->findOrFail($teamId);

        foreach ($team->users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title'   => $title,
                'message' => $message,
                'type'    => $type,
            ]);

            event(new UserNotification($user, $message));
        }
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

        $project = Project::create([
            'team_id'     => $validated['team_id'],
            'owner_id'    => auth()->id(),
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'] ?? 'planning',
            'start_date'  => $validated['start_date'] ?? null,
            'due_date'    => $validated['due_date'] ?? null,
        ]);

        $this->notifyTeamMembers(
            $validated['team_id'],
            'New Project Assigned',
            "You have been assigned to a new project: {$project->name}",
            'success'
        );

        return redirect()
            ->route('projects.index')
            ->with('message', 'Project created successfully!');
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'team_id'     => 'required|exists:teams,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:planning,ongoing,on_hold,completed,cancelled',
            'start_date'  => 'nullable|date',
            'due_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $oldTeamId = $project->team_id;
        $newTeamId = $validated['team_id'];
        $teamChanged = $oldTeamId !== (int) $newTeamId;

        $project->update([
            'team_id'     => $newTeamId,
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'] ?? $project->status,
            'start_date'  => $validated['start_date'] ?? $project->start_date,
            'due_date'    => $validated['due_date'] ?? $project->due_date,
        ]);

        if ($teamChanged) {
            // Notify old team - removed
            $this->notifyTeamMembers(
                $oldTeamId,
                'Project Removed',
                "Your team has been removed from project: {$project->name}",
                'warning'
            );

            // Notify new team - assigned
            $this->notifyTeamMembers(
                $newTeamId,
                'New Project Assigned',
                "Your team has been assigned to project: {$project->name}",
                'success'
            );
        } else {
            // Same team - notify about update
            $this->notifyTeamMembers(
                $newTeamId,
                'Project Updated',
                "Project \"{$project->name}\" has been updated.",
                'info'
            );
        }

        return redirect()
            ->route('projects.index')
            ->with('message', 'Project updated successfully!');
    }
}
