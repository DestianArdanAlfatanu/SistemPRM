import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { Calendar, List, Plus } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  unit: string
  room_name: string
  meeting_date: string
  start_time: string
  end_time: string
  backgroundColor: string
  borderColor: string
}

interface Props {
  events: CalendarEvent[]
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Booking Meeting", href: "/admin/bookings" },
  { title: "Kalender", href: "/admin/bookings-calendar" },
]

export default function CalendarView({ events }: Props) {
  const calendarRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 10

  const totalPages = Math.ceil(events.length / eventsPerPage)
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  )

  useEffect(() => {
    if (calendarRef.current) {
      // initialize calendar here
    }
  }, [events])

  const handleCreateBooking = () => {
    console.log("Navigate to create booking")
  }

  const handleListView = () => {
    console.log("Navigate to list view")
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto bg-gradient-to-br from-blue-50 to-slate-50">
        <Card className="flex-1 border-blue-200 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calendar className="h-7 w-7" />
                  Kalender Booking Meeting
                </CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  Lihat jadwal booking meeting dalam tampilan kalender yang terorganisir
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateBooking}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-md"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={handleListView}
                  className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold bg-transparent"
                >
                  <List className="mr-2 h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 min-h-[600px] shadow-inner">
              <div ref={calendarRef} className="h-full">
                <div className="text-center py-12">
                  <div className="bg-blue-900 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">Kalender Booking Meeting</h3>
                  <p className="text-blue-700 mb-8 text-lg">
                    Menampilkan <span className="font-semibold text-blue-900">{events.length}</span> booking yang telah disetujui
                  </p>

                  {events.length > 0 ? (
                    <>
                      <div className="grid gap-4 max-w-2xl mx-auto">
                        <h4 className="text-lg font-semibold text-blue-900 mb-4">Booking Terbaru</h4>
                        {paginatedEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col gap-3 p-5 bg-white border border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-sm">
                              <div className="flex items-center gap-2 text-blue-700">
                                <span className="font-medium">Unit:</span>
                                <span className="bg-blue-50 px-2 py-1 rounded text-blue-800">{event.unit}</span>
                              </div>
                              <div className="flex items-center gap-2 text-blue-700">
                                <span className="font-medium">Ruangan:</span>
                                <span className="bg-blue-50 px-2 py-1 rounded text-blue-800">{event.room_name}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                              <span className="text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                                {event.meeting_date}
                              </span>
                              <span className="text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                                {event.start_time} - {event.end_time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Buttons */}
                      <div className="flex justify-center items-center mt-6 gap-4">
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="bg-blue-800 text-white hover:bg-blue-700"
                        >
                          Sebelumnya
                        </Button>
                        <span className="text-blue-800 font-semibold">
                          Halaman {currentPage} dari {totalPages}
                        </span>
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="bg-blue-800 text-white hover:bg-blue-700"
                        >
                          Selanjutnya
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-8 max-w-md mx-auto">
                      <p className="text-blue-700 text-lg font-medium">Belum ada booking yang disetujui</p>
                      <p className="text-blue-600 text-sm mt-2">Buat booking baru untuk melihat jadwal di kalender</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
