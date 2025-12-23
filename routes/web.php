<?php

use Illuminate\Support\Facades\Route;

// Customer routes - root and all customer pages
Route::get('/', function () {
    return view('app');
});

// Admin login route
Route::get('/login', function () {
    return view('app');
});

// Admin dashboard routes
Route::get('/staff/{any?}', function () {
    return view('app');
})->where('any', '.*');

// API routes are already handled in api.php