<?php
// app/Http/Controllers/TaskController.php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Project $project)
    {
        $project->load(['owner', 'team']);

        $statuses = TaskStatus::where('project_id', $project->id)
            ->with(['tasks' => function ($query) {
                $query->with('assignedUser')->orderBy('order');
            }])
            ->orderBy('order')
            ->get();

        // Get team members for assignment
        $teamMembers = $project->team->users ?? collect();

        return Inertia::render('tasks/Index', [
            'project' => $project,
            'statuses' => $statuses,
            'teamMembers' => $teamMembers,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'task_status_id' => 'required|exists:task_statuses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $validated['project_id'] = $project->id;

        // Set order to last in the status
        $maxOrder = Task::where('task_status_id', $validated['task_status_id'])->max('order') ?? -1;
        $validated['order'] = $maxOrder + 1;

        Task::create($validated);

        return back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Project $project, Task $task)
    {
        // Ensure task belongs to this project
        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task updated successfully.');
    }

    public function updateStatus(Request $request, Project $project, Task $task)
    {
        // Ensure task belongs to this project
        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'task_status_id' => 'required|exists:task_statuses,id',
            'order' => 'required|integer|min:0',
        ]);

        // Verify the status belongs to this project
        $status = TaskStatus::findOrFail($validated['task_status_id']);
        if ($status->project_id !== $project->id) {
            abort(403);
        }

        $task->update($validated);

        return back();
    }

    public function destroy(Project $project, Task $task)
    {
        // Ensure task belongs to this project
        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $task->delete();

        return back()->with('success', 'Task deleted successfully.');
    }
}
