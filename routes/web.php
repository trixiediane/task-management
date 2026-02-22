<?php

use App\Events\TestEvent;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskStatusController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Teams
    Route::get('teams', [TeamController::class, 'index'])->name('teams.index');
    Route::get('teams/create', [TeamController::class, 'create'])->name('teams.create');
    Route::post('teams', [TeamController::class, 'store'])->name('teams.store');
    Route::get('teams/{team}/edit', [TeamController::class, 'edit'])->name('teams.edit');
    Route::put('teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::post('teams/assign-users', [TeamController::class, 'assignUsers'])
        ->name('teams.assign-users');
    Route::get('/teams/{team}/users', [TeamController::class, 'getTeamUsers'])->name('teams.getTeamUsers');
    Route::post('/teams/assign-users', [TeamController::class, 'assignUsers'])->name('teams.assignUsers');

    // Users
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::put('users/{user}/change-password', [UserController::class, 'changePassword'])
        ->name('users.changePassword');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Projects
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');

    // Task Statuses
    Route::post('projects/{project}/task-statuses', [TaskStatusController::class, 'store'])
        ->name('task-statuses.store');
    Route::put('projects/{project}/task-statuses/{taskStatus}', [TaskStatusController::class, 'update'])
        ->name('task-statuses.update');
    Route::delete('projects/{project}/task-statuses/{taskStatus}', [TaskStatusController::class, 'destroy'])
        ->name('task-statuses.destroy');

    // Tasks
    Route::get('projects/{project}/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('projects/{project}/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('projects/{project}/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::put('projects/{project}/tasks/{task}/status', [TaskController::class, 'updateStatus'])
        ->name('tasks.update-status');
    Route::delete('projects/{project}/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    Route::get('/test-event', function () {
        event(new TestEvent("Hey what is up"));
    });
});

require __DIR__ . '/settings.php';
