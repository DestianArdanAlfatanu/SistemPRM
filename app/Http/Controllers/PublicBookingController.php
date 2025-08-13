<?php

namespace App\Http\Controllers;

use App\Models\MeetingBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicBookingController extends Controller
{
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
            'booked_by_email' => 'required|email|max:255',
            'booked_by_phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:1000',
        ], [
            'unit.required' => 'Unit harus dipilih',
            'room_name.required' => 'Nama ruangan harus dipilih',
            'topic.required' => 'Topik meeting harus diisi',
            'meeting_date.required' => 'Tanggal meeting harus diisi',
            'meeting_date.after_or_equal' => 'Tanggal meeting tidak boleh kurang dari hari ini',
            'start_time.required' => 'Waktu mulai harus diisi',
            'end_time.required' => 'Waktu selesai harus diisi',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai',
            'booked_by_name.required' => 'Nama pemesan harus diisi',
            'booked_by_email.required' => 'Email pemesan harus diisi',
            'booked_by_email.email' => 'Format email tidak valid',
            'booked_by_phone.required' => 'Nomor telepon harus diisi',
        ]);

        // Check for conflicting bookings
        $conflictBooking = $this->checkConflictingBookings(
            $validated['room_name'],
            $validated['meeting_date'],
            $validated['start_time'],
            $validated['end_time']
        );

        if ($conflictBooking) {
            return response()->json([
                'success' => false,
                'message' => 'Ruangan sudah dibooking pada waktu tersebut. Silakan pilih waktu lain.',
                'errors' => []
            ], 422);
        }

        $startTime = \Carbon\Carbon::parse($validated['start_time']);
        $endTime = \Carbon\Carbon::parse($validated['end_time']);
        $durationHours = $endTime->diffInHours($startTime, true);

        $bookingCode = $this->generateBookingCode();

        try {
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
                'status' => 'pending', // User bookings start as pending
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking berhasil dikirim dan menunggu persetujuan.',
                'booking_code' => $bookingCode,
                'data' => $booking
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating booking: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan booking. Silakan coba lagi.',
                'errors' => []
            ], 500);
        }
    }

    public function check(Request $request)
    {
        $validated = $request->validate([
            'booking_code' => 'required|string'
        ], [
            'booking_code.required' => 'Kode booking harus diisi'
        ]);

        $booking = MeetingBooking::where('booking_code', $validated['booking_code'])
            ->with(['creator', 'approver'])
            ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Kode booking tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'booking_code' => $booking->booking_code,
                'unit' => $booking->unit,
                'room_name' => $booking->room_name,
                'topic' => $booking->topic,
                'meeting_date' => $booking->meeting_date->format('d/m/Y'),
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'duration' => $this->formatDuration($booking->duration_hours),
                'booked_by_name' => $booking->booked_by_name,
                'booked_by_email' => $booking->booked_by_email,
                'booked_by_phone' => $booking->booked_by_phone,
                'status' => $booking->status,
                'status_label' => $this->getStatusLabel($booking->status),
                'status_color' => $this->getStatusColor($booking->status),
                'notes' => $booking->notes,
                'created_at' => $booking->created_at->format('d/m/Y H:i'),
            ]
        ]);
    }

    public function getRecentBookings()
    {
        try {
            $bookings = MeetingBooking::with(['creator', 'approver'])
                ->whereDate('meeting_date', '>=', today())
                ->orderBy('meeting_date', 'asc')
                ->orderBy('start_time', 'asc')
                ->limit(8)
                ->get()
                ->map(function ($booking) {
                    return [
                        'booking_code' => $booking->booking_code,
                        'room_name' => $booking->room_name,
                        'unit' => $booking->unit,
                        'topic' => $booking->topic,
                        'meeting_date' => $booking->meeting_date->format('d M Y'),
                        'time_range' => $booking->start_time . ' - ' . $booking->end_time,
                        'status' => $booking->status,
                        'status_label' => $this->getStatusLabel($booking->status),
                        'status_color' => $this->getStatusColor($booking->status),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching recent bookings: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data booking terbaru',
                'data' => []
            ], 500);
        }
    }

    public function getAvailableSlots(Request $request)
    {
        $validated = $request->validate([
            'room_name' => 'required|string',
            'date' => 'required|date'
        ]);

        try {
            $bookedSlots = MeetingBooking::where('room_name', $validated['room_name'])
                ->whereDate('meeting_date', $validated['date'])
                ->whereIn('status', ['pending', 'approved']) // Only check pending and approved bookings
                ->select(['start_time', 'end_time'])
                ->get()
                ->map(function ($booking) {
                    return [
                        'start' => $booking->start_time,
                        'end' => $booking->end_time
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'booked_slots' => $bookedSlots,
                    'available_hours' => $this->getAvailableHours($bookedSlots)
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching available slots: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data slot tersedia',
                'data' => [
                    'booked_slots' => [],
                    'available_hours' => []
                ]
            ], 500);
        }
    }

    private function checkConflictingBookings($roomName, $date, $startTime, $endTime)
    {
        return MeetingBooking::where('room_name', $roomName)
            ->whereDate('meeting_date', $date)
            ->whereIn('status', ['pending', 'approved']) // Only check pending and approved bookings
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($q) use ($startTime, $endTime) {
                    // New booking starts during existing booking
                    $q->where('start_time', '<=', $startTime)
                        ->where('end_time', '>', $startTime);
                })->orWhere(function ($q) use ($startTime, $endTime) {
                    // New booking ends during existing booking
                    $q->where('start_time', '<', $endTime)
                        ->where('end_time', '>=', $endTime);
                })->orWhere(function ($q) use ($startTime, $endTime) {
                    // New booking encompasses existing booking
                    $q->where('start_time', '>=', $startTime)
                        ->where('end_time', '<=', $endTime);
                });
            })
            ->exists();
    }

    private function generateBookingCode()
    {
        do {
            $code = 'BK-' . date('Ymd') . '-' . strtoupper(Str::random(4));
        } while (MeetingBooking::where('booking_code', $code)->exists());

        return $code;
    }

    private function getStatusLabel($status)
    {
        return match ($status) {
            'pending' => 'Menunggu Persetujuan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'cancelled' => 'Dibatalkan',
            default => 'Tidak Diketahui'
        };
    }

    private function getStatusColor($status)
    {
        return match ($status) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            'cancelled' => 'gray',
            default => 'gray'
        };
    }

    private function formatDuration($hours)
    {
        if ($hours >= 1) {
            $wholeHours = floor($hours);
            $minutes = ($hours - $wholeHours) * 60;

            if ($minutes > 0) {
                return $wholeHours . ' jam ' . round($minutes) . ' menit';
            }
            return $wholeHours . ' jam';
        } else {
            $minutes = $hours * 60;
            return round($minutes) . ' menit';
        }
    }

    private function getAvailableHours($bookedSlots)
    {
        $workingHours = [];
        for ($hour = 8; $hour <= 17; $hour++) {
            $workingHours[] = sprintf('%02d:00', $hour);
        }

        $availableHours = [];
        foreach ($workingHours as $hour) {
            $isAvailable = true;
            foreach ($bookedSlots as $slot) {
                if ($hour >= $slot['start'] && $hour < $slot['end']) {
                    $isAvailable = false;
                    break;
                }
            }
            if ($isAvailable) {
                $availableHours[] = $hour;
            }
        }

        return $availableHours;
    }
}
