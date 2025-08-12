"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Calendar, Clock, Save } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Booking Meeting", href: "/admin/bookings" },
  { title: "Buat Booking", href: "/admin/bookings/create" },
]

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    unit: "",
    room_name: "",
    topic: "",
    meeting_date: "",
    start_time: "",
    end_time: "",
    booked_by_name: "",
    booked_by_email: "",
    booked_by_phone: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post("/admin/bookings")
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat Booking Meeting" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto bg-gradient-to-br from-blue-50 to-blue-100">
        <Card className="max-w-2xl mx-auto w-full shadow-xl border-blue-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-blue-800/50">
                <Link href="/admin/bookings">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <CardTitle className="text-white text-xl font-semibold">Buat Booking Meeting</CardTitle>
                <CardDescription className="text-blue-100">
                  Reservasi ruang meeting untuk kebutuhan rapat dan diskusi tim
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="unit" className="text-blue-900 font-medium">
                    Unit
                  </Label>
                  <Select onValueChange={(value) => setData("unit", value)} value={data.unit}>
                    <SelectTrigger
                      className={`border-2 focus:border-blue-500 ${errors.unit ? "border-red-500" : "border-blue-200"}`}
                    >
                      <SelectValue placeholder="Pilih Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OBL, LEGAL & COMPLIANCE">OBL, LEGAL & COMPLIANCE</SelectItem>
                      <SelectItem value="PROJECT OPERATION">PROJECT OPERATION</SelectItem>
                      <SelectItem value="PARTNERSHIP SLA">PARTNERSHIP SLA</SelectItem>
                      <SelectItem value="RESOURCE & INVOICING">RESOURCE & INVOICING</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-sm text-red-500 font-medium">{errors.unit}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="room_name" className="text-blue-900 font-medium">
                    Nama Ruangan
                  </Label>
                  <Select onValueChange={(value) => setData("room_name", value)} value={data.room_name}>
                    <SelectTrigger
                      className={`border-2 focus:border-blue-500 ${errors.room_name ? "border-red-500" : "border-blue-200"}`}
                    >
                      <SelectValue placeholder="Pilih Ruangan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meeting Room 1">Meeting Room 1</SelectItem>
                      <SelectItem value="Meeting Room 2">Meeting Room 2</SelectItem>
                      <SelectItem value="Meeting Room 3">Meeting Room 3</SelectItem>
                      <SelectItem value="Conference Room">Conference Room</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.room_name && <p className="text-sm text-red-500 font-medium">{errors.room_name}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="topic" className="text-blue-900 font-medium">
                  Topik Meeting
                </Label>
                <Textarea
                  id="topic"
                  placeholder="Masukkan topik meeting"
                  value={data.topic}
                  onChange={(e) => setData("topic", e.target.value)}
                  className={`border-2 focus:border-blue-500 min-h-[100px] ${errors.topic ? "border-red-500" : "border-blue-200"}`}
                  required
                />
                {errors.topic && <p className="text-sm text-red-500 font-medium">{errors.topic}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="meeting_date" className="text-blue-900 font-medium">
                    Tanggal Meeting
                  </Label>
                  <div className="relative">
                    <Input
                      id="meeting_date"
                      type="date"
                      value={data.meeting_date}
                      onChange={(e) => setData("meeting_date", e.target.value)}
                      className={`border-2 focus:border-blue-500 pr-10 ${errors.meeting_date ? "border-red-500" : "border-blue-200"}`}
                      required
                    />
                  </div>
                  {errors.meeting_date && <p className="text-sm text-red-500 font-medium">{errors.meeting_date}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="start_time" className="text-blue-900 font-medium">
                    Waktu Mulai
                  </Label>
                  <div className="relative">
                    <Input
                      id="start_time"
                      type="time"
                      value={data.start_time}
                      onChange={(e) => setData("start_time", e.target.value)}
                      className={`border-2 focus:border-blue-500 pr-10 ${errors.start_time ? "border-red-500" : "border-blue-200"}`}
                      required
                    />
                  </div>
                  {errors.start_time && <p className="text-sm text-red-500 font-medium">{errors.start_time}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="end_time" className="text-blue-900 font-medium">
                    Waktu Selesai
                  </Label>
                  <div className="relative">
                    <Input
                      id="end_time"
                      type="time"
                      value={data.end_time}
                      onChange={(e) => setData("end_time", e.target.value)}
                      className={`border-2 focus:border-blue-500 pr-10 ${errors.end_time ? "border-red-500" : "border-blue-200"}`}
                      required
                    />
                  </div>
                  {errors.end_time && <p className="text-sm text-red-500 font-medium">{errors.end_time}</p>}
                </div>
              </div>

              <div className="space-y-6 border-t-2 border-blue-200 pt-6">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-900 rounded"></div>
                  Informasi Pemesan
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label htmlFor="booked_by_name" className="text-blue-900 font-medium">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="booked_by_name"
                      type="text"
                      placeholder="Nama pemesan"
                      value={data.booked_by_name}
                      onChange={(e) => setData("booked_by_name", e.target.value)}
                      className={`border-2 focus:border-blue-500 ${errors.booked_by_name ? "border-red-500" : "border-blue-200"}`}
                      required
                    />
                    {errors.booked_by_name && (
                      <p className="text-sm text-red-500 font-medium">{errors.booked_by_name}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="booked_by_email" className="text-blue-900 font-medium">
                      Email
                    </Label>
                    <Input
                      id="booked_by_email"
                      type="email"
                      placeholder="email@example.com"
                      value={data.booked_by_email}
                      onChange={(e) => setData("booked_by_email", e.target.value)}
                      className={`border-2 focus:border-blue-500 ${errors.booked_by_email ? "border-red-500" : "border-blue-200"}`}
                    />
                    {errors.booked_by_email && (
                      <p className="text-sm text-red-500 font-medium">{errors.booked_by_email}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="booked_by_phone" className="text-blue-900 font-medium">
                      No. Telepon
                    </Label>
                    <Input
                      id="booked_by_phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={data.booked_by_phone}
                      onChange={(e) => setData("booked_by_phone", e.target.value)}
                      className={`border-2 focus:border-blue-500 ${errors.booked_by_phone ? "border-red-500" : "border-blue-200"}`}
                    />
                    {errors.booked_by_phone && (
                      <p className="text-sm text-red-500 font-medium">{errors.booked_by_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-blue-900 font-medium">
                  Catatan Tambahan
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan atau permintaan khusus..."
                  value={data.notes}
                  onChange={(e) => setData("notes", e.target.value)}
                  className={`border-2 focus:border-blue-500 min-h-[80px] ${errors.notes ? "border-red-500" : "border-blue-200"}`}
                />
                {errors.notes && <p className="text-sm text-red-500 font-medium">{errors.notes}</p>}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t-2 border-blue-100">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                >
                  <Link href="/admin/bookings">Batal</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-900 hover:bg-blue-800 text-white shadow-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? "Menyimpan..." : "Submit Booking"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
