<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'position',
        'image',
        'bio',
        'facebook',
        'twitter',
        'instagram',
        'order'
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
