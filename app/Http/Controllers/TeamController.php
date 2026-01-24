<?php
namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with('createdBy', 'updatedBy')
            ->latest()
            ->get();

        return Inertia::render('teams/Index', compact('teams'));
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

}
