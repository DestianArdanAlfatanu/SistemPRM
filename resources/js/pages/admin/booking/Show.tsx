import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, Clock, Edit, Mail, Phone, User, X } from 'lucide-react';

interface MeetingBooking {
    id: string;
    booking_code: string;
    unit: string;
    room_name: string;
    topic: string;
    meeting_date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    booked_by_name: string;
    booked_by_email?: string;
    booked_by_phone?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    notes?: string;
    creator?: { name: string };
    approver?: { name: string };
    created_at: string;
    updated_at: string;
}

interface Props {
    booking: MeetingBooking;
}

export default function Show({ booking }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Booking Meeting', href: '/admin/bookings' },
        { title: booking.booking_code, href: `/admin/bookings/${booking.id}` },
    ];

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };
        return <Badge className={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
    };

    const handleApprove = () => {
        router.patch(`/admin/bookings/${booking.id}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = () => {
        router.patch(`/admin/bookings/${booking.id}/reject`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Booking - ${booking.booking_code}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card className="max-w-4xl mx-auto w-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/admin/bookings">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <div>
                                    <CardTitle>Detail Booking Meeting</CardTitle>
                                    <CardDescription>Kode: {booking.booking_code}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(booking.status)}
                                {booking.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                                            <Check className="mr-2 h-4 w-4" />
                                            Setujui
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={handleReject} className="bg-red-600 text-white hover:bg-red-700">
                                            <X className="mr-2 h-4 w-4" />
                                            Tolak
                                        </Button>
                                    </div>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/bookings/${booking.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-9" />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Meeting Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Informasi Meeting</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Unit</label>
                                        <p className="text-base">{booking.unit}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Ruangan</label>
                                        <p className="text-base">{booking.room_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Topik Meeting</label>
                                        <p className="text-base">{booking.topic}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Tanggal Meeting</label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <p className="text-base">{new Date(booking.meeting_date).toLocaleDateString('id-ID', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Waktu</label>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <p className="text-base">{booking.start_time} - {booking.end_time} ({booking.duration_hours} jam)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Booker Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Informasi Pembooking</h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <p className="text-base">{booking.booked_by_name}</p>
                                    </div>
                                </div>
                                {booking.booked_by_email && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <p className="text-base">{booking.booked_by_email}</p>
                                        </div>
                                    </div>
                                )}
                                {booking.booked_by_phone && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">No. Telepon</label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <p className="text-base">{booking.booked_by_phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {booking.notes && (
                            <>
                                <Separator />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Catatan</label>
                                    <p className="text-base mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">{booking.notes}</p>
                                </div>
                            </>
                        )}

                        <Separator />

                        {/* System Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Informasi Sistem</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Dibuat pada</label>
                                    <p className="text-base">{new Date(booking.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Terakhir diupdate</label>
                                    <p className="text-base">{new Date(booking.updated_at).toLocaleString('id-ID')}</p>
                                </div>
                                {booking.creator && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Dibuat oleh</label>
                                        <p className="text-base">{booking.creator.name}</p>
                                    </div>
                                )}
                                {booking.approver && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Disetujui oleh</label>
                                        <p className="text-base">{booking.approver.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}