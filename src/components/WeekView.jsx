"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

const WeekView = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  events,
  onEventClick,
  onDateClick,
  onTimeSlotClick,
}) => {
  const [draggedEvent, setDraggedEvent] = useState(null)

  // Get the start of the week (Sunday)
  const getWeekStart = (date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    start.setHours(0, 0, 0, 0)
    return start
  }

  const weekStart = getWeekStart(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    return day
  })

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const getEventsForDateAndHour = (date, hour) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventDate = eventStart.toDateString()
      const eventHour = eventStart.getHours()
      return eventDate === date.toDateString() && eventHour === hour
    })
  }

  const handleTimeSlotClick = (date, hour) => {
    const clickedDateTime = new Date(date)
    clickedDateTime.setHours(hour, 0, 0, 0)
    setSelectedDate(clickedDateTime)
    onTimeSlotClick(clickedDateTime)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" })
    const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" })
    const startDay = weekStart.getDate()
    const endDay = weekEnd.getDate()
    const year = weekStart.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Week Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{formatWeekRange()}</h2>
          <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex overflow-hidden h-full">
        {/* Time column */}
        <div className="w-20 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="h-16"></div> {/* Header spacer */}
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-start justify-center pt-2"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-cols-7 min-w-full">
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "h-16 border-r border-gray-200 dark:border-gray-700 p-2 text-center",
                  "bg-gray-50 dark:bg-gray-800",
                  isToday(day) && "bg-blue-50 dark:bg-blue-900/20",
                )}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={cn(
                    "text-lg font-semibold mt-1",
                    isToday(day) ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white",
                  )}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}

            {/* Time slots grid */}
            {timeSlots.map((hour) =>
              weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDateAndHour(day, hour)
                return (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={cn(
                      "h-16 border-r border-b border-gray-200 dark:border-gray-700 p-1 cursor-pointer",
                      "hover:bg-gray-50 dark:hover:bg-gray-800",
                      isToday(day) && "bg-blue-50/30 dark:bg-blue-900/10",
                    )}
                    onClick={() => handleTimeSlotClick(day, hour)}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                        className={cn(
                          "text-xs p-1 rounded mb-1 cursor-pointer truncate",
                          event.type === "leave" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                          event.color === "blue" &&
                            event.type !== "leave" &&
                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                          event.color === "green" &&
                            event.type !== "leave" &&
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                          event.color === "purple" &&
                            event.type !== "leave" &&
                            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                          event.color === "pink" &&
                            event.type !== "leave" &&
                            "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekView
