import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Check, Clock, Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

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
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    creator?: { name: string };
    approver?: { name: string };
    created_at: string;
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    today: number;
}

interface Props {
    bookings: {
        data: MeetingBooking[];
        links: any[];
        meta: any;
    };
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking Meeting', href: '/admin/bookings' },
];

export default function Index({ bookings, filters, stats }: Props) {
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/bookings', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = () => {
        router.get('/admin/bookings', { ...filters, search: searchValue }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };
        return <Badge className={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
    };

    const handleApprove = (id: string) => {
        router.patch(`/admin/bookings/${id}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = (id: string) => {
        router.patch(`/admin/bookings/${id}/reject`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Meeting" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Daftar Booking Meeting</CardTitle>
                                <CardDescription>Kelola semua booking meeting ruangan</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild>
                                    <Link href="/admin/bookings/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Booking
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/bookings-calendar">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Kalender
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex gap-2 flex-1">
                                <Input
                                    placeholder="Cari booking..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="max-w-sm"
                                />
                                <Button onClick={handleSearch} variant="outline">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Select onValueChange={(value) => handleFilter('status', value === 'all' ? '' : value)}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="date"
                                    placeholder="Dari tanggal"
                                    onChange={(e) => handleFilter('date_from', e.target.value)}
                                    className="w-[150px]"
                                />
                                <Input
                                    type="date"
                                    placeholder="Sampai tanggal"
                                    onChange={(e) => handleFilter('date_to', e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode Booking</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Topik</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Pembooking</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings?.data?.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.booking_code}</TableCell>
                                            <TableCell>{booking.unit}</TableCell>
                                            <TableCell>{booking.room_name}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">{booking.topic}</TableCell>
                                            <TableCell>{new Date(booking.meeting_date).toLocaleDateString('id-ID')}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {booking.start_time} - {booking.end_time}
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.booked_by_name}</TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/bookings/${booking.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/bookings/${booking.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleApprove(booking.id)}
                                                                className="text-green-600"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReject(booking.id)}
                                                                className="text-red-600"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) || (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8">
                                                Tidak ada data booking ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {bookings?.meta?.total && bookings.meta.total > bookings.meta.per_page && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {bookings.meta.from} sampai {bookings.meta.to} dari {bookings.meta.total} data
                                </div>
                                <div className="flex gap-2">
                                    {bookings.links?.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}