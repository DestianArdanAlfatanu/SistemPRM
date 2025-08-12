import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, List, Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
}

interface Props {
    events: CalendarEvent[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking Meeting', href: '/admin/bookings' },
    { title: 'Kalender', href: '/admin/bookings-calendar' },
];

export default function CalendarView({ events }: Props) {
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Here you would integrate with a calendar library like FullCalendar
        // For now, we'll create a simple month view
        if (calendarRef.current) {
            // Initialize calendar here
        }
    }, [events]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kalender Booking" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Kalender Booking Meeting</CardTitle>
                                <CardDescription>Lihat jadwal booking meeting dalam tampilan kalender</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild>
                                    <Link href="/admin/bookings/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Booking
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/bookings">
                                        <List className="mr-2 h-4 w-4" />
                                        List View
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-lg border p-4 min-h-[600px]">
                            <div ref={calendarRef} className="h-full">
                                {/* Simple calendar placeholder - replace with actual calendar library */}
                                <div className="text-center py-20">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        Kalender Booking
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Kalender akan menampilkan {events.length} booking yang telah disetujui
                                    </p>
                                    <div className="grid gap-2 max-w-md mx-auto">
                                        {events.slice(0, 5).map((event) => (
                                            <div key={event.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: event.backgroundColor }}
                                                />
                                                <span className="text-sm">{event.title}</span>
                                            </div>
                                        ))}
                                        {events.length > 5 && (
                                            <p className="text-sm text-gray-500">
                                                +{events.length - 5} booking lainnya
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}