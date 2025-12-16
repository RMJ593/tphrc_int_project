<?php

use Illuminate\Support\Facades\Route;

// Redirect root to login
Route::get('/', function () {
    return redirect('/login');
});

// All routes should serve the React app
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');