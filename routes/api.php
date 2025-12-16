<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\UserResponseController;
use App\Http\Controllers\Api\TableBookingController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HeroBannerController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuLinkController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public data (no auth required)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{menuItem}', [MenuItemController::class, 'show']);
Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{page}', [PageController::class, 'show']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);

// Hero Banners (Public - no auth required)
Route::get('/hero-banners', [HeroBannerController::class, 'index']);
Route::get('/hero-banners/{heroBanner}', [HeroBannerController::class, 'show']);
Route::post('/hero-banners', [HeroBannerController::class, 'store']);
Route::put('/hero-banners/{heroBanner}', [HeroBannerController::class, 'update']);
Route::delete('/hero-banners/{heroBanner}', [HeroBannerController::class, 'destroy']);

// Public contact/booking
Route::post('/user-responses', [UserResponseController::class, 'store']);
Route::post('/table-bookings', [TableBookingController::class, 'store']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Categories (Admin)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Menu Items (Admin)
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy']);

    // User Responses (Admin)
    Route::get('/user-responses', [UserResponseController::class, 'index']);
    Route::get('/user-responses/{userResponse}', [UserResponseController::class, 'show']);
    Route::put('/user-responses/{userResponse}', [UserResponseController::class, 'update']);
    Route::delete('/user-responses/{userResponse}', [UserResponseController::class, 'destroy']);

    // Table Bookings (Admin)
    Route::get('/table-bookings', [TableBookingController::class, 'index']);
    Route::get('/table-bookings/{tableBooking}', [TableBookingController::class, 'show']);
    Route::put('/table-bookings/{tableBooking}', [TableBookingController::class, 'update']);
    Route::delete('/table-bookings/{tableBooking}', [TableBookingController::class, 'destroy']);

    // Pages (Admin)
    Route::post('/pages', [PageController::class, 'store']);
    Route::put('/pages/{page}', [PageController::class, 'update']);
    Route::delete('/pages/{page}', [PageController::class, 'destroy']);

    // Blogs (Admin)
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);

    // Blog Categories (Admin)
    Route::apiResource('blog-categories', BlogCategoryController::class);

    // Team Members (Admin)
    Route::post('/team-members', [TeamMemberController::class, 'store']);
    Route::put('/team-members/{teamMember}', [TeamMemberController::class, 'update']);
    Route::delete('/team-members/{teamMember}', [TeamMemberController::class, 'destroy']);

    // Testimonials (Admin)
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    // Gallery (Admin)
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{galleryImage}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{galleryImage}', [GalleryController::class, 'destroy']);

    // Menus & Links (Admin)
    Route::apiResource('menus', MenuController::class);
    Route::apiResource('menu-links', MenuLinkController::class);

    // Settings (Admin)
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'update']);
    Route::post('/clear-cache', [SettingsController::class, 'clearCache']);
});