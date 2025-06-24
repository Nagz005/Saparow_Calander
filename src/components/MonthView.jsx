"use client"

import { useState } from "react"
import { cn } from "../lib/utils"

const MonthView = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  events,
  getEventsForDate,
  onEventClick,
  onDateClick,
  onEventDrop,
}) => {
  const [draggedEvent, setDraggedEvent] = useState(null)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const isToday = (date) => date.toDateString() === today.toDateString()
  const isSelected = (date) => selectedDate && date.toDateString() === selectedDate.toDateString()
  const isSameMonth = (date) => date.getMonth() === currentMonth

  const handleDragStart = (e, event) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, date) => {
    e.preventDefault()
    if (draggedEvent) {
      onEventDrop(draggedEvent, date)
      setDraggedEvent(null)
    }
  }

  const renderCalendarDays = () => {
    const days = []
    const totalCells = 42 // 6 weeks * 7 days

    // Previous month days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0)
    const daysInPrevMonth = prevMonth.getDate()

    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
      days.push(renderDay(date, false))
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      days.push(renderDay(date, true))
    }

    // Next month days
    const remainingCells = totalCells - days.length
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day)
      days.push(renderDay(date, false))
    }

    return days
  }

  const renderDay = (date, isCurrentMonth) => {
    const dayEvents = getEventsForDate(date)
    const dayKey = date.toISOString().split("T")[0]

    return (
      <div
        key={dayKey}
        className={cn(
          "min-h-[120px] border border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-colors",
          "hover:bg-gray-50 dark:hover:bg-gray-800",
          isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800",
          isToday(date) && "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600",
          isSelected(date) && "ring-2 ring-blue-500",
        )}
        onClick={() => {
          setSelectedDate(date)
          onDateClick(date)
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, date)}
      >
        <div
          className={cn(
            "text-sm font-medium mb-2",
            isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600",
            isToday(date) && "text-blue-600 dark:text-blue-400 font-bold",
          )}
        >
          {date.getDate()}
        </div>

        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              draggable
              onDragStart={(e) => handleDragStart(e, event)}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              className={cn(
                "text-xs p-1 rounded cursor-pointer truncate transition-all hover:shadow-md",
                event.color === "blue" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                event.color === "green" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                event.color === "red" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                event.color === "purple" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                event.color === "pink" && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
              )}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 3} more</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">{renderCalendarDays()}</div>
    </div>
  )
}

export default MonthView
