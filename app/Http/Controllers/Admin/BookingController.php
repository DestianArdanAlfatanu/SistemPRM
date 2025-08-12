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

        return Inertia::render('admin/booking/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
            'stats' => [
                'total' => MeetingBooking::count(),
                'pending' => MeetingBooking::where('status', 'pending')->count(),
                'approved' => MeetingBooking::where('status', 'approved')->count(),
                'rejected' => MeetingBooking::where('status', 'rejected')->count(),
                'today' => MeetingBooking::whereDate('meeting_date', today())->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/booking/Create');
    }

public function store(Request $request)
{
    // 1. Validasi input
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

    // 2. Cek konflik jadwal dengan benar
    $conflict = MeetingBooking::where('room_name', $validated['room_name'])
        ->where('meeting_date', $validated['meeting_date'])
        ->whereIn('status', ['approved', 'pending']) // <-- Hanya cek status ini
        ->where(function ($query) use ($validated) {
            $query->where('start_time', '<', $validated['end_time'])
                  ->where('end_time', '>', $validated['start_time']);
        })
        ->exists();

    // 3. Tentukan status dan pesan berdasarkan hasil pengecekan konflik
    if ($conflict) {
        $status = 'rejected';
        $message = 'Booking gagal! Jadwal bentrok dan otomatis ditolak.';
    } else {
        $status = 'approved';
        $message = 'Booking berhasil dibuat.';
    }

    // 4. Hitung durasi
    $startTime = \Carbon\Carbon::parse($validated['start_time']);
    $endTime = \Carbon\Carbon::parse($validated['end_time']);
    $durationHours = $endTime->diffInHours($startTime);

    // 5. Simpan data ke database dengan HANYA SATU KALI create()
    MeetingBooking::create([
        'booking_code' => $this->generateBookingCode(),
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
        'status' => $status, // Variabel $status pasti punya nilai ('rejected' atau 'approved')
        'created_by' => Auth::id(),
        'approved_by' => ($status === 'approved') ? Auth::id() : null,
    ]);

    // 6. Redirect dengan pesan yang sesuai
    $redirect = redirect()->route('admin.bookings.index');
    
    return ($status === 'rejected')
        ? $redirect->with('error', $message)
        : $redirect->with('success', $message);
}

    public function show(MeetingBooking $booking)
    {
        $booking->load(['creator', 'approver']);

        return Inertia::render('admin/booking/Show', [
            'booking' => $booking
        ]);
    }

    public function edit(MeetingBooking $booking)
    {
        // Pastikan tanggal diformat Y-m-d agar cocok dengan input type="date"
        $booking->meeting_date = \Carbon\Carbon::parse($booking->meeting_date)->format('Y-m-d');

        return Inertia::render('admin/booking/Edit', [
            'booking' => $booking
        ]);
    }

    /**
     * Update data booking.
     */
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

        // Hitung durasi jam
        $startTime = \Carbon\Carbon::parse($validated['start_time']);
        $endTime = \Carbon\Carbon::parse($validated['end_time']);
        $durationHours = $endTime->diffInHours($startTime);

        // Simpan data
        $booking->update([
            'unit' => $validated['unit'],
            'room_name' => $validated['room_name'],
            'topic' => $validated['topic'],
            'meeting_date' => \Carbon\Carbon::parse($validated['meeting_date'])->format('Y-m-d'),
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
            ->select(['id', 'unit', 'booking_code', 'room_name', 'topic', 'meeting_date', 'start_time', 'end_time'])
            ->get()
            ->map(function ($booking) {
                 return [
                    'id' => $booking->id,
                    'title' => $booking->topic,
                    'unit' => $booking->unit,
                    'room_name' => $booking->room_name,
                    'meeting_date' => $booking->meeting_date->format('Y-m-d'),
                    'start_time' => $booking->start_time->format('H:i'),
                    'end_time' => $booking->end_time->format('H:i'),
                    'backgroundColor' => '#2563eb',
                    'borderColor' => '#2563eb',
                ];
            });

        return Inertia::render('admin/booking/Calendar', [
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
