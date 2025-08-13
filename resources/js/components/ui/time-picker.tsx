"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

interface TimePickerProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  availableSlots?: string[] // ✅ TAMBAHAN: untuk cek availability
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  className,
  availableSlots = [], // ✅ TAMBAHAN: default empty array
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null)
  const [displayValue, setDisplayValue] = useState(value || "09:00")
  const [isOpen, setIsOpen] = useState(false)
  const hourRef = useRef<HTMLDivElement | null>(null)
  const minuteRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const didMount = useRef(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5) // 0, 5, 10, 15, ..., 55

  // set initial value saat mount
  useEffect(() => {
    if (!value) return
    const [hour, minute] = value.split(":").map(Number)
    setSelectedHour(hour)
    setSelectedMinute(minute)
    setDisplayValue(value)
    if (!didMount.current) {
      // scroll ke posisi awal saat pertama kali render
      hourRef.current?.scrollTo({ top: hour * 40, behavior: "auto" })
      minuteRef.current?.scrollTo({ top: Math.floor(minute / 5) * 40, behavior: "auto" })
      didMount.current = true
    }
  }, [value])

  // Handle click outside untuk close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle ESC key untuk close dropdown
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen])

  // ✅ TAMBAHAN: Function untuk cek availability
  const isTimeSlotAvailable = (hour: number, minute: number) => {
    if (availableSlots.length === 0) return true // Jika tidak ada restriction, semua available

    const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    return availableSlots.includes(timeString)
  }

  const handleSelect = (hour: number, minute: number) => {
    // ✅ TAMBAHAN: Cek availability sebelum select
    if (!isTimeSlotAvailable(hour, minute)) return

    setSelectedHour(hour)
    setSelectedMinute(minute)
    const formatted = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    setDisplayValue(formatted)
    onChange?.(formatted)
  }

  const handleInputClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          onClick={handleInputClick}
          className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring cursor-pointer transition-all duration-200"
        />
        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-center space-x-6">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">Jam</div>
                <div
                  ref={hourRef}
                  className="h-40 w-16 overflow-y-scroll scroll-smooth snap-y border border-gray-200 rounded bg-gray-50"
                >
                  {hours.map((h) => {
                    // ✅ TAMBAHAN: Cek availability untuk jam ini (dengan menit 0)
                    const isAvailable = isTimeSlotAvailable(h, selectedMinute ?? 0)

                    return (
                      <div
                        key={h}
                        className={cn(
                          "h-10 flex items-center justify-center text-sm snap-start transition-colors duration-150",
                          !isAvailable
                            ? "text-red-600 cursor-not-allowed" // ✅ UBAH: Red theme untuk booked slots
                            : selectedHour === h
                              ? "bg-blue-600 text-white font-semibold" // ✅ TETAP: Red theme untuk selected
                              : "text-gray-700 hover:bg-gray-100 cursor-pointer",
                        )}
                        onClick={() => isAvailable && handleSelect(h, selectedMinute ?? 0)}
                      >
                        {h.toString().padStart(2, "0")}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Separator */}
              <div className="text-2xl font-bold text-gray-400 mt-8">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">Menit</div>
                <div
                  ref={minuteRef}
                  className="h-40 w-16 overflow-y-scroll scroll-smooth snap-y border border-gray-200 rounded bg-gray-50"
                >
                  {minutes.map((m) => {
                    // ✅ TAMBAHAN: Cek availability untuk menit ini
                    const isAvailable = isTimeSlotAvailable(selectedHour ?? 0, m)

                    return (
                      <div
                        key={m}
                        className={cn(
                          "h-10 flex items-center justify-center text-sm snap-start transition-colors duration-150",
                          !isAvailable
                            ? " text-red-600 cursor-not-allowed" // ✅ UBAH: Red theme untuk booked slots
                            : selectedMinute === m
                              ? "bg-blue-600 text-white font-semibold" // ✅ TETAP: Red theme untuk selected
                              : "text-gray-700 hover:bg-gray-100 cursor-pointer",
                        )}
                        onClick={() => isAvailable && handleSelect(selectedHour ?? 0, m)}
                      >
                        {m.toString().padStart(2, "0")}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimePicker
