<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Team extends Model
{
    protected $guarded = [];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_users');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, foreignKey: 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, foreignKey: 'updated_by');
    }
}
