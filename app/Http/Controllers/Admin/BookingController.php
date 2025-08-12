<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = MeetingBooking::with(['creator', 'approver'])
            ->orderBy('meeting_date', 'desc')
            ->orderBy('start_time', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('meeting_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('meeting_date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                    ->orWhere('unit', 'like', "%{$search}%")
                    ->orWhere('room_name', 'like', "%{$search}%")
                    ->orWhere('topic', 'like', "%{$search}%")
                    ->orWhere('booked_by_name', 'like', "%{$search}%");
            });
        }

        $bookings = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Booking/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
            'stats' => [
                'total' => MeetingBooking::count(),
                'pending' => MeetingBooking::where('status', 'pending')->count(),
                'approved' => MeetingBooking::where('status', 'approved')->count(),
                'today' => MeetingBooking::whereDate('meeting_date', today())->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Booking/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit' => 'required|string|max:255',
            'room_name' => 'required|string|max:255',
            'topic' => 'required|string|max:500',
            'meeting_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'booked_by_name' => 'required|string|max:255',
            'booked_by_email' => 'nullable|email|max:255',
            'booked_by_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:1000',
        ]);

        $startTime = \Carbon\Carbon::parse($validated['start_time']);
        $endTime = \Carbon\Carbon::parse($validated['end_time']);
        $durationHours = $endTime->diffInHours($startTime);

        $bookingCode = $this->generateBookingCode();

        $booking = MeetingBooking::create([
            'booking_code' => $bookingCode,
            'unit' => $validated['unit'],
            'room_name' => $validated['room_name'],
            'topic' => $validated['topic'],
            'meeting_date' => $validated['meeting_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration_hours' => $durationHours,
            'booked_by_name' => $validated['booked_by_name'],
            'booked_by_email' => $validated['booked_by_email'],
            'booked_by_phone' => $validated['booked_by_phone'],
            'notes' => $validated['notes'],
            'status' => 'approved',
            'created_by' => Auth::id(),
            'approved_by' => Auth::id(),
        ]);

        return redirect()->route('admin.bookings.index')
            ->with('success', "Booking berhasil dibuat dengan kode: {$bookingCode}");
    }

    public function show(MeetingBooking $booking)
    {
        $booking->load(['creator', 'approver']);

        return Inertia::render('Admin/Booking/Show', [
            'booking' => $booking
        ]);
    }

    public function edit(MeetingBooking $booking)
    {
        return Inertia::render('Admin/Booking/Edit', [
            'booking' => $booking
        ]);
    }

    public function update(Request $request, MeetingBooking $booking)
    {
        $validated = $request->validate([
            'unit' => 'required|string|max:255',
            'room_name' => 'required|string|max:255',
            'topic' => 'required|string|max:500',
            'meeting_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'booked_by_name' => 'required|string|max:255',
            'booked_by_email' => 'nullable|email|max:255',
            'booked_by_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|in:pending,approved,rejected,cancelled',
        ]);

        $startTime = \Carbon\Carbon::parse($validated['start_time']);
        $endTime = \Carbon\Carbon::parse($validated['end_time']);
        $durationHours = $endTime->diffInHours($startTime);

        $booking->update([
            'unit' => $validated['unit'],
            'room_name' => $validated['room_name'],
            'topic' => $validated['topic'],
            'meeting_date' => $validated['meeting_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration_hours' => $durationHours,
            'booked_by_name' => $validated['booked_by_name'],
            'booked_by_email' => $validated['booked_by_email'],
            'booked_by_phone' => $validated['booked_by_phone'],
            'notes' => $validated['notes'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking berhasil diupdate');
    }

    public function destroy(MeetingBooking $booking)
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking berhasil dihapus');
    }

    public function approve(MeetingBooking $booking)
    {
        $booking->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
        ]);

        return back()->with('success', 'Booking berhasil disetujui');
    }

    public function reject(Request $request, MeetingBooking $booking)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string|max:500'
        ]);

        $booking->update([
            'status' => 'rejected',
            'notes' => $validated['rejection_reason'] ?? $booking->notes,
        ]);

        return back()->with('success', 'Booking berhasil ditolak');
    }

    public function calendar()
    {
        $bookings = MeetingBooking::approved()
            ->select(['id', 'booking_code', 'room_name', 'topic', 'meeting_date', 'start_time', 'end_time'])
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'title' => "{$booking->room_name} - {$booking->topic}",
                    'start' => $booking->meeting_date->format('Y-m-d') . 'T' . $booking->start_time,
                    'end' => $booking->meeting_date->format('Y-m-d') . 'T' . $booking->end_time,
                    'backgroundColor' => $this->getStatusColor($booking->status),
                    'borderColor' => $this->getStatusColor($booking->status),
                ];
            });

        return Inertia::render('Admin/Booking/Calendar', [
            'events' => $bookings
        ]);
    }

    private function generateBookingCode()
    {
        do {
            $code = 'BK-' . date('Ymd') . '-' . strtoupper(Str::random(4));
        } while (MeetingBooking::where('booking_code', $code)->exists());

        return $code;
    }

    private function getStatusColor($status)
    {
        return match ($status) {
            'pending' => '#f59e0b',
            'approved' => '#10b981',
            'rejected' => '#ef4444',
            'cancelled' => '#6b7280',
            default => '#6b7280'
        };
    }
}
