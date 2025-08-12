<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_bookings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('booking_code')->unique();
            $table->string('unit');
            $table->string('room_name');
            $table->string('topic');
            $table->date('meeting_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_hours')->default(1);
            $table->string('booked_by_name');
            $table->string('booked_by_email')->nullable();
            $table->string('booked_by_phone')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->string('created_by')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamps();

            $table->index(['meeting_date', 'start_time']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_bookings');
    }
};
