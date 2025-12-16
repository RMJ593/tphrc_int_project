<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $fillable = [
        'title',
        'image',
        'description',
        'order'
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
