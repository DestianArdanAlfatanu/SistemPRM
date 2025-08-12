<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingBooking extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'booking_code',
        'unit',
        'room_name',
        'topic',
        'meeting_date',
        'start_time',
        'end_time',
        'duration_hours',
        'booked_by_name',
        'booked_by_email',
        'booked_by_phone',
        'status',
        'notes',
        'created_by',
        'approved_by',
    ];

    protected $casts = [
        'meeting_date' => 'date:Y-m-d',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('meeting_date', today());
    }
}
