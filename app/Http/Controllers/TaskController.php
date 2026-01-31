<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Project $project)
    {
        $tasks = Task::where('project_id', $project->id)->get();

        // Pass both tasks and project to Inertia
        return Inertia::render('tasks/Index', [
            'tasks' => $tasks,
            'project' => $project,  
        ]);
    }
}
