<?php

use App\Http\Controllers\TeamController;
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
    Route::get('teams', [TeamController::class, 'index'])->name('teams.index');
    Route::get('teams/create', [TeamController::class, 'create'])->name('teams.create');
    Route::post('teams', [TeamController::class, 'store'])->name('teams.store');
    Route::get('teams/{team}/edit', [TeamController::class, 'edit'])->name('teams.edit');
    Route::put('teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::post('teams/assign-users', [TeamController::class, 'assignUsers'])
        ->name('teams.assign-users');
});

require __DIR__ . '/settings.php';
