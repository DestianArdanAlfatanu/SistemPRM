"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, Link, router } from "@inertiajs/react"
import { Calendar, Check, Clock, Eye, Pencil, Plus, Search, X } from "lucide-react"
import { useState } from "react"

interface MeetingBooking {
  id: string
  booking_code: string
  unit: string
  room_name: string
  topic: string
  meeting_date: string
  start_time: string
  end_time: string
  duration_hours: number
  booked_by_name: string
  booked_by_email?: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  creator?: { name: string }
  approver?: { name: string }
  created_at: string
}

interface Stats {
  total: number
  pending: number
  approved: number
  today: number
}

interface Props {
  bookings: {
    data: MeetingBooking[]
    links: any[]
    meta: any
  }
  filters: {
    status?: string
    date_from?: string
    date_to?: string
    search?: string
  }
  stats: Stats
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Booking Meeting", href: "/admin/bookings" },
]

export default function Index({ bookings, filters, stats }: Props) {
  const [searchValue, setSearchValue] = useState(filters.search || "")

  const handleFilter = (key: string, value: string) => {
    router.get("/admin/bookings", { ...filters, [key]: value }, { preserveState: true })
  }

  const handleSearch = () => {
    router.get("/admin/bookings", { ...filters, search: searchValue }, { preserveState: true })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 shadow-sm",
      approved: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm",
      rejected: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 shadow-sm",
      cancelled: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200 shadow-sm",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} font-medium px-3 py-1`}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const handleApprove = (id: string) => {
    router.patch(`/admin/bookings/${id}/approve`, {}, { preserveScroll: true })
  }

  const handleReject = (id: string) => {
    router.patch(`/admin/bookings/${id}/reject`, {}, { preserveScroll: true })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Booking Meeting" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-slate-50 overflow-x-auto">
        <div className="grid auto-rows-min gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-100">Total Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-blue-200 mt-1">Semua booking</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-yellow-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-100">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.pending}</div>
              <p className="text-xs text-amber-100 mt-1">Menunggu persetujuan</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-emerald-100">Disetujui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.approved}</div>
              <p className="text-xs text-emerald-100 mt-1">Booking aktif</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-100">Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.today}</div>
              <p className="text-xs text-blue-200 mt-1">Meeting hari ini</p>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 border-0 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white">Daftar Booking Meeting</CardTitle>
                <CardDescription className="text-blue-100">
                  Kelola semua booking meeting ruangan dengan mudah
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 border-0 shadow-md font-medium" asChild>
                  <Link href="/admin/bookings/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Booking
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-200 bg-transparent"
                  asChild
                >
                  <Link href="/admin/bookings-calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Kalender
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center pt-4 border-t border-blue-700">
              <div className="flex gap-3 flex-1">
                <Input
                  placeholder="Cari booking..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="max-w-sm bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <Button onClick={handleSearch} className="bg-blue-700 hover:bg-blue-600 border-0 shadow-md">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Select onValueChange={(value) => handleFilter("status", value === "all" ? "" : value)}>
                  <SelectTrigger className="w-[150px] bg-white border-blue-200 focus:border-blue-400">
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
                  onChange={(e) => handleFilter("date_from", e.target.value)}
                  className="w-[150px] bg-white border-blue-200 focus:border-blue-400"
                />
                <Input
                  type="date"
                  placeholder="Sampai tanggal"
                  onChange={(e) => handleFilter("date_to", e.target.value)}
                  className="w-[150px] bg-white border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="rounded-lg border border-blue-100 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-blue-100">
                    <TableHead className="font-semibold text-blue-900">Kode Booking</TableHead>
                    <TableHead className="font-semibold text-blue-900">Unit</TableHead>
                    <TableHead className="font-semibold text-blue-900">Ruangan</TableHead>
                    <TableHead className="font-semibold text-blue-900">Topik</TableHead>
                    <TableHead className="font-semibold text-blue-900">Tanggal</TableHead>
                    <TableHead className="font-semibold text-blue-900">Waktu</TableHead>
                    <TableHead className="font-semibold text-blue-900">Pembooking</TableHead>
                    <TableHead className="font-semibold text-blue-900">Status</TableHead>
                    <TableHead className="font-semibold text-blue-900">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.data?.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                    >
                      <TableCell className="font-medium text-blue-900">{booking.booking_code}</TableCell>
                      <TableCell className="text-slate-700">{booking.unit}</TableCell>
                      <TableCell className="text-slate-700 font-medium">{booking.room_name}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-600">{booking.topic}</TableCell>
                      <TableCell className="text-slate-700">
                        {new Date(booking.meeting_date).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-sm font-medium">
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700 font-medium">{booking.booked_by_name}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-700" asChild>
                            <Link href={`/admin/bookings/${booking.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-700" asChild>
                            <Link href={`/admin/bookings/${booking.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(booking.id)}
                                className="text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(booking.id)}
                                className="text-red-600 hover:bg-red-100 hover:text-red-700"
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
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="text-slate-500">
                          <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <p className="text-lg font-medium">Tidak ada data booking ditemukan</p>
                          <p className="text-sm">Coba ubah filter pencarian Anda</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {bookings?.meta?.total && bookings.meta.total > bookings.meta.per_page && (
              <div className="mt-6 flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-100">
                <div className="text-sm text-slate-600 font-medium">
                  Menampilkan <span className="text-blue-900 font-semibold">{bookings.meta.from}</span> sampai{" "}
                  <span className="text-blue-900 font-semibold">{bookings.meta.to}</span> dari{" "}
                  <span className="text-blue-900 font-semibold">{bookings.meta.total}</span> data
                </div>
                <div className="flex gap-2">
                  {bookings.links?.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url}
                      className={
                        link.active
                          ? "bg-blue-900 hover:bg-blue-800 border-0 shadow-md"
                          : "border-blue-200 text-blue-700 hover:bg-blue-100"
                      }
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
  )
}
