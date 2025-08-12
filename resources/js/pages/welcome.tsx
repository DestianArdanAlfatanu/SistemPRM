"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TimePicker from "../components/ui/time-picker"
import { PublicLayout } from "@/layouts/public-layout"
import { Calendar, Clock, Users, MapPin, Phone, Mail, ChevronDown, Star } from "lucide-react"

function PRMWebsite() {
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("12:00")
  // Added dark mode state detection
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Added theme detection with MutationObserver
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const units = ["OBL, LEGAL & COMPLIANCE", "PROJECT OPERATION", "PARTNERSHIP SLA", "RESOURCE & INVOICING"]

  const meetingRooms = ["Meeting Room 1", "Meeting Room 2", "Meeting Room 3", "Conference Room"]

  const unitData = [
    {
      name: "OBL, LEGAL & COMPLIANCE",
      description:
        "Memastikan kepatuhan hukum dan regulasi dalam seluruh aspek operasional perusahaan dan mengelola operasional bisnis dan layanan utama perusahaan",
      icon: <Clock className="h-12 w-12" />,
      color: "text-blue-900 dark:text-blue-400",
    },
    {
      name: "PROJECT OPERATION",
      description: "Mengelola dan mengawasi pelaksanaan proyek-proyek strategis perusahaan",
      icon: <Users className="h-12 w-12" />,
      color: "text-green-600 dark:text-green-400",
    },
    {
      name: "PARTNERSHIP SLA",
      description: "Mengelola kemitraan strategis dan Service Level Agreement dengan mitra bisnis",
      icon: <MapPin className="h-12 w-12" />,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "RESOURCE & INVOICING",
      description: "Mengelola sumber daya perusahaan dan sistem penagihan untuk optimalisasi keuangan",
      icon: <Phone className="h-12 w-12" />,
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  const chief = [
    {
      nama: "TOTO RUDIARTO",
      posisi: "KEPALA PROYEK RESOLUTION MANAGEMENT",
      foto: "/Toto.png?w=300&h=300&fit=crop",
      deskripsi: "20+ years experience in telecommunications and digital transformation.",
    },
  ]

  const team = [
    {
      name: "PAULUS CAHYO WIDHIATMOKO",
      position: "COORDINATOR PROJECT OPERATION",
      image: "/PAK PAULUS.png?w=300&h=300&fit=crop",
      description: "20+ years experience in telecommunications and digital transformation.",
    },
    {
      name: "PRASASTA ARISANTI",
      position: " COORDINATOR RESOURCE & INVOICING",
      image: "/IBU PRAS.png?w=300&h=300&fit=crop",
      description: "Expert in cloud architecture and enterprise solutions with 15 years experience.",
    },
    {
      name: "ANDANG ASHARI, S.T.",
      position: "COORDINATOR PARTNERSHIP SLA",
      image: "/laki.jpg?w=300&h=300&fit=crop",
      description: "Specialized in network infrastructure and project management for large-scale deployments.",
    },
    {
      name: "FX.ALI SARTONO, S.T.",
      position: "COORDINATOR OBL, LEGAL & COMPLIANCE",
      image: "/laki.jpg?w=300&h=300&fit=crop",
      description: "Specialized in network infrastructure and project management for large-scale deployments.",
    },
  ]

  const testimonials = [
    {
      name: "PT. Indonesia Power",
      position: "Chief Technology Officer",
      content:
        "PRM's expertise in digital transformation has been instrumental in modernizing our operations. Their professional approach and technical excellence exceeded our expectations.",
      rating: 5,
    },
    {
      name: "Bank Mandiri",
      position: "IT Director",
      content:
        "The cybersecurity solutions provided by PRM have significantly enhanced our security posture. Their team's dedication and expertise are truly commendable.",
      rating: 5,
    },
    {
      name: "Pertamina",
      position: "Head of Digital Innovation",
      content:
        "Working with PRM on our cloud migration project was seamless. They delivered on time and within budget while maintaining the highest quality standards.",
      rating: 5,
    },
  ]

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)

    const startTotalMinutes = startHour * 60 + startMinute
    const endTotalMinutes = endHour * 60 + endMinute

    const durationMinutes = endTotalMinutes - startTotalMinutes
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    if (hours > 0 && minutes > 0) {
      return `${hours} jam ${minutes} menit`
    } else if (hours > 0) {
      return `${hours} jam`
    } else {
      return `${minutes} menit`
    }
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-900 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              PRM
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mt-2 text-blue-100">
                Empowering Digital Future with Telkom
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Leading Indonesia's digital transformation through innovative technology solutions, robust infrastructure,
              and strategic partnerships.
            </p>
            <Button
              onClick={() => scrollToSection("about")}
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Pelajari Lebih Lanjut
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white rotate-90" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tentang Kami</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              PRM adalah divisi strategis Telkom Indonesia yang berfokus pada transformasi digital dan solusi teknologi
              enterprise untuk memajukan Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg">
                <Users className="h-12 w-12 text-blue-900 dark:text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Visi Kami</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Menjadi pemimpin dalam transformasi digital Indonesia dengan menyediakan solusi teknologi terdepan
                  yang mendorong pertumbuhan ekonomi dan kemajuan bangsa.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg">
                <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Misi Kami</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Memberikan solusi teknologi inovatif, membangun infrastruktur digital yang handal, dan memberdayakan
                  talenta terbaik untuk menciptakan nilai berkelanjutan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg">
            {/* ISTIGHFAR Image */}
            <div className="flex justify-center mb-8">
              {/* Istighfar logo switches based on dark mode */}
              <img
                src={isDarkMode ? "/Logo Istighfar Putih.png" : "/Logo Istighfar.png"}
                alt="ISTIGHFAR Framework"
                className="h-30"
              />
            </div>

            {/* ISTIGHFAR Explanation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div className="border-l-4 border-red-600 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">I - Integrated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Integrated administration of the CFMS population to ensure seamless business process execution
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">STI - Systems TIC</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Systems TIC administration and payment of the CFMS population that aligns with established policies
                  and guidelines
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">G - Governance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Governance as the core principle to ensure compliance with regulations and uphold ethical business
                  practices
                </p>
              </div>

              <div className="border-l-4 border-teal-600 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">HF - Healthy Profit</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Healthy profit as the foundation to achieve a win-win solution between Telkom and the partners
                </p>
              </div>

              <div className="border-l-4 border-cyan-600 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AR - Accounting Realistic</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Accounting Realistic to guarantee adherence to current financial policies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Meeting Room Section */}
      <section id="booking" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Booking Meeting Room</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Reservasi ruang meeting untuk kebutuhan rapat dan diskusi tim Anda.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Form Booking Meeting Room</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                    <select className="w-full px-3 py-2 border border-input bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring">
                      <option value="" className="text-xs sm:text-sm">
                        Pilih Unit
                      </option>
                      {units.map((unit, index) => (
                        <option key={index} value={unit} className="text-xs sm:text-sm">
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Ruangan
                    </label>
                    <select className="w-full px-3 py-2 border border-input bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring">
                      <option value="" className="text-xs sm:text-sm">
                        Pilih Ruangan
                      </option>
                      {meetingRooms.map((room, index) => (
                        <option key={index} value={room} className="text-xs sm:text-sm">
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic Meeting
                  </label>
                  <Input
                    placeholder="Masukkan topik meeting"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Meeting
                    </label>
                    <Input
                      type="date"
                      className="transition-all duration-300 focus:scale-[1.02] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <TimePicker label="Waktu Mulai" value={startTime} onChange={setStartTime} />
                  <TimePicker label="Waktu Selesai" value={endTime} onChange={setEndTime} />
                </div>

                {/* Duration Display */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>Durasi meeting: </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {calculateDuration(startTime, endTime)}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                  Submit Booking
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {/* Booking Status Examples */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Status Booking Terbaru
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold text-gray-900 dark:text-white">Meeting Room 1</div>
                      <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs">
                        Pending
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">OBL, LEGAL & COMPLIANCE</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Project Review</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">25 Des 2025, 09:00-11:00</div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold text-gray-900 dark:text-white">Meeting Room 2</div>
                      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs">
                        Approved
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Partnership SLA</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Compliance Meeting</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">26 Des 2025, 08:00-10:00</div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold text-gray-900 dark:text-white">Meeting Room 3</div>
                      <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs">
                        Rejected
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">PROJECT OPERATION</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Planning</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">27 Des 2025, 10:00-12:00</div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold text-gray-900 dark:text-white">Conference Room</div>
                      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs">
                        Approved
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">PROJECT OPERATION</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Finishing</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">31 Des 2025, 10:00-12:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unit Section */}
      <section id="unit" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Unit Organisasi</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Struktur organisasi PRM yang terdiri dari berbagai unit spesialisasi untuk mendukung operasional
              perusahaan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {unitData.map((unit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 group hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-center">
                  <div
                    className={`${unit.color} group-hover:scale-110 transition-transform duration-300 flex justify-center mb-4`}
                  >
                    {unit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{unit.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">{unit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar of Events */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Calendar of Events</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg p-2 mr-3">
                    <div className="text-xs font-semibold">AUG</div>
                    <div className="text-lg font-bold">17</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Upacara Hari Kemerdekaan</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">07:00 - 11:00 WIB</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Upacara Bendera Memperingati Hari Kemerdakaan Indonesia untuk semua unit PRM.
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs border border-gray-300 dark:border-gray-500 dark:text-gray-300 px-2 py-1 rounded">
                    All Units
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Halaman Telkom Indibiz</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg p-2 mr-3">
                    <div className="text-xs font-semibold">AUG</div>
                    <div className="text-lg font-bold">18</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Cuti Bersama Nasional</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">08:00 - 17:00 WIB</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Cuti Bersama Hari Kemerdekaan Republik Indonesia
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs border border-gray-300 dark:border-gray-500 dark:text-gray-300 px-2 py-1 rounded">
                    All Units
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">-</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg p-2 mr-3">
                    <div className="text-xs font-semibold">AUG</div>
                    <div className="text-lg font-bold">20</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Lomba HUT RI 80</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">09:00 - 16:00 WIB</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Lomba Antar Unit PRM</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs border border-gray-300 dark:border-gray-500 dark:text-gray-300 px-2 py-1 rounded">
                    All Units
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Halaman Telkom Indibiz</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tim Kami</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Dipimpin oleh para ahli berpengalaman yang berdedikasi untuk memberikan yang terbaik.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            {chief.map((member, index) => (
              <div
                key={index}
                className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-6">
                  <img
                    src={member.foto || "/placeholder.svg"}
                    alt={member.nama}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.nama}</h3>
                <p className="text-blue-900 dark:text-blue-400 font-medium mb-3">{member.posisi}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{member.name}</h4>
                <p className="text-blue-900 dark:text-blue-400 font-medium text-sm">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Testimoni Klien</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kepercayaan dan kepuasan klien adalah prioritas utama kami.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <Star className="h-8 w-8 text-blue-900 dark:text-blue-400" />
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Hubungi Kami</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Siap membantu transformasi digital perusahaan Anda. Mari berdiskusi tentang kebutuhan teknologi Anda.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kirim Pesan</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama Lengkap
                      </label>
                      <Input
                        placeholder="Masukkan nama lengkap"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="nama@perusahaan.com"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Perusahaan
                    </label>
                    <Input
                      placeholder="Nama perusahaan"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesan</label>
                    <textarea
                      placeholder="Ceritakan tentang kebutuhan teknologi perusahaan Anda..."
                      rows={5}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full p-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <Button className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                    Kirim Pesan
                    <Mail className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-900 dark:text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Alamat Kantor</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Telkom Indibiz Experience - Jakarta Pusat
                      <br />
                      Jl. Kebon Sirih No.36, Gambir, Kecamatan Gambir
                      <br />
                      Kota Jakarta Pusat Daerah Khusus Ibukota Jakarta 10340
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-900 dark:text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Telepon</h4>
                    <p className="text-gray-600 dark:text-gray-300">+62 22 7566 5000</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-900 dark:text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">prm@telkom.co.id</p>
                  </div>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Lokasi Kami</h4>
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.610160646332!2d106.8241632750374!3d-6.1828991938046025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x65cfeea36bcefb5%3A0x5163245d7deb4a95!2sTelkom%20Indibiz%20Experience%20-%20Jakarta%20Pusat!5e0!3m2!1sid!2sid!4v1754624345676!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default PRMWebsite
