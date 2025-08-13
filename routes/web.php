<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\PublicBookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public booking routes (tidak perlu auth)
Route::prefix('booking')->name('booking.')->group(function () {
    Route::post('/', [PublicBookingController::class, 'store'])->name('store');
    Route::post('/check', [PublicBookingController::class, 'check'])->name('check');
    Route::get('/recent', [PublicBookingController::class, 'getRecentBookings'])->name('recent');
    Route::get('/available-slots', [PublicBookingController::class, 'getAvailableSlots'])->name('available-slots');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('bookings', BookingController::class);
        Route::patch('bookings/{booking}/approve', [BookingController::class, 'approve'])->name('bookings.approve');
        Route::patch('bookings/{booking}/reject', [BookingController::class, 'reject'])->name('bookings.reject');
        Route::get('bookings-calendar', [BookingController::class, 'calendar'])->name('bookings.calendar');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
