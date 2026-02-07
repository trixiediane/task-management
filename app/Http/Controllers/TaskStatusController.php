<?php
// app/Http/Controllers/TaskStatusController.php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TaskStatus;
use Illuminate\Http\Request;

class TaskStatusController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:7',
        ]);

        $validated['project_id'] = $project->id;

        // Set order to be last
        $maxOrder = TaskStatus::where('project_id', $project->id)->max('order') ?? -1;
        $validated['order'] = $maxOrder + 1;

        TaskStatus::create($validated);

        return back()->with('success', 'Task status created successfully.');
    }

    public function update(Request $request, Project $project, TaskStatus $taskStatus)
    {
        // Ensure the status belongs to this project
        if ($taskStatus->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'color' => 'sometimes|string|max:7',
            'order' => 'sometimes|integer|min:0',
        ]);

        $taskStatus->update($validated);

        return back()->with('success', 'Task status updated successfully.');
    }

    public function destroy(Project $project, TaskStatus $taskStatus)
    {
        // Ensure the status belongs to this project
        if ($taskStatus->project_id !== $project->id) {
            abort(403);
        }

        // Check if there are tasks in this status
        if ($taskStatus->tasks()->count() > 0) {
            return back()->withErrors([
                'status' => 'Cannot delete a status that has tasks. Please move or delete the tasks first.'
            ]);
        }

        $taskStatus->delete();

        return back()->with('success', 'Task status deleted successfully.');
    }
}
