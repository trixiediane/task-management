<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('status', 'planning')
            ->orderBy('start_date', 'DESC')
            ->paginate(10);

        return Inertia::render('projects/Index', compact('projects'));
    }
}
