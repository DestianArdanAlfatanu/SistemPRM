import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Save } from 'lucide-react';

interface MeetingBooking {
    id: string;
    booking_code: string;
    unit: string;
    room_name: string;
    topic: string;
    meeting_date: string;
    start_time: string;
    end_time: string;
    booked_by_name: string;
    booked_by_email?: string;
    booked_by_phone?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    notes?: string;
}

interface Props {
    booking: MeetingBooking;
}

export default function Edit({ booking }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Booking Meeting', href: '/admin/bookings' },
        { title: booking.booking_code, href: `/admin/bookings/${booking.id}` },
        { title: 'Edit', href: `/admin/bookings/${booking.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        unit: booking.unit,
        room_name: booking.room_name,
        topic: booking.topic,
        meeting_date: booking.meeting_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        booked_by_name: booking.booked_by_name,
        booked_by_email: booking.booked_by_email || '',
        booked_by_phone: booking.booked_by_phone || '',
        notes: booking.notes || '',
        status: booking.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/bookings/${booking.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Booking - ${booking.booking_code}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/bookings/${booking.id}`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <CardTitle>Edit Booking Meeting</CardTitle>
                                <CardDescription>Kode: {booking.booking_code}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select onValueChange={(value) => setData('unit', value)} value={data.unit}>
                                        <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OBL, LEGAL & COMPLIANCE">OBL, LEGAL & COMPLIANCE</SelectItem>
                                            <SelectItem value="PROJECT OPERATION">PROJECT OPERATION</SelectItem>
                                            <SelectItem value="PARTNERSHIP SLA">PARTNERSHIP SLA</SelectItem>
                                            <SelectItem value="RESOURCE & INVOICING">RESOURCE & INVOICING</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="room_name">Nama Ruangan</Label>
                                    <Select onValueChange={(value) => setData('room_name', value)} value={data.room_name}>
                                        <SelectTrigger className={errors.room_name ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Ruangan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Meeting Room 1">Meeting Room 1</SelectItem>
                                            <SelectItem value="Meeting Room 2">Meeting Room 2</SelectItem>
                                            <SelectItem value="Meeting Room 3">Meeting Room 3</SelectItem>
                                            <SelectItem value="Conference Room">Conference Room</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.room_name && <p className="text-sm text-red-500">{errors.room_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="topic">Topik Meeting</Label>
                                <Textarea
                                    id="topic"
                                    value={data.topic}
                                    onChange={(e) => setData('topic', e.target.value)}
                                    className={errors.topic ? 'border-red-500' : ''}
                                    required
                                />
                                {errors.topic && <p className="text-sm text-red-500">{errors.topic}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="meeting_date">Tanggal Meeting</Label>
                                    <div className="relative">
                                        <Input
                                            id="meeting_date"
                                            type="date"
                                            value={data.meeting_date}
                                            onChange={(e) => setData('meeting_date', e.target.value)}
                                            className={errors.meeting_date ? 'border-red-500' : ''}
                                            required
                                        />
                                    </div>
                                    {errors.meeting_date && <p className="text-sm text-red-500">{errors.meeting_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Waktu Mulai</Label>
                                    <div className="relative">
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className={errors.start_time ? 'border-red-500' : ''}
                                            required
                                        />
                                    </div>
                                    {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">Waktu Selesai</Label>
                                    <div className="relative">
                                        <Input
                                            id="end_time"
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className={errors.end_time ? 'border-red-500' : ''}
                                            required
                                        />
                                    </div>
                                    {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Informasi Pemesan</h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="booked_by_name">Nama Lengkap</Label>
                                        <Input
                                            id="booked_by_name"
                                            type="text"
                                            value={data.booked_by_name}
                                            onChange={(e) => setData('booked_by_name', e.target.value)}
                                            className={errors.booked_by_name ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.booked_by_name && <p className="text-sm text-red-500">{errors.booked_by_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="booked_by_email">Email</Label>
                                        <Input
                                            id="booked_by_email"
                                            type="email"
                                            value={data.booked_by_email}
                                            onChange={(e) => setData('booked_by_email', e.target.value)}
                                            className={errors.booked_by_email ? 'border-red-500' : ''}
                                        />
                                        {errors.booked_by_email && <p className="text-sm text-red-500">{errors.booked_by_email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="booked_by_phone">No. Telepon</Label>
                                        <Input
                                            id="booked_by_phone"
                                            type="tel"
                                            value={data.booked_by_phone}
                                            onChange={(e) => setData('booked_by_phone', e.target.value)}
                                            className={errors.booked_by_phone ? 'border-red-500' : ''}
                                        />
                                        {errors.booked_by_phone && <p className="text-sm text-red-500">{errors.booked_by_phone}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as any)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className={errors.notes ? 'border-red-500' : ''}
                                />
                                {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/admin/bookings/${booking.id}`}>Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Update Booking'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}