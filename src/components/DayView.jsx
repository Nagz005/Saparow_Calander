"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

const DayView = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getEventsForHour = (hour) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventDate = eventStart.toDateString()
      const eventHour = eventStart.getHours()
      return eventDate === currentDate.toDateString() && eventHour === hour
    })
  }

  const handleTimeSlotClick = (hour) => {
    const clickedDateTime = new Date(currentDate)
    clickedDateTime.setHours(hour, 0, 0, 0)
    setSelectedDate(clickedDateTime)
    onTimeSlotClick(clickedDateTime)
  }

  const isToday = () => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }

  const formatDate = () => {
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Day Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigateDay("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2
            className={cn(
              "text-lg font-semibold",
              isToday() ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white",
            )}
          >
            {formatDate()}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigateDay("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex overflow-hidden h-full">
        {/* Time column */}
        <div className="w-20 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b border-gray-200 dark:border-gray-700 flex items-start justify-center pt-2"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="flex-1 overflow-y-auto">
          {timeSlots.map((hour) => {
            const hourEvents = getEventsForHour(hour)
            return (
              <div
                key={hour}
                className={cn(
                  "h-20 border-b border-gray-200 dark:border-gray-700 p-2 cursor-pointer",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  isToday() && "bg-blue-50/30 dark:bg-blue-900/10",
                )}
                onClick={() => handleTimeSlotClick(hour)}
              >
                <div className="space-y-1">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className={cn(
                        "text-sm p-2 rounded cursor-pointer shadow-sm border-l-4",
                        event.type === "leave" &&
                          "bg-red-50 border-red-400 text-red-800 dark:bg-red-900/20 dark:text-red-200",
                        event.color === "blue" &&
                          event.type !== "leave" &&
                          "bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
                        event.color === "green" &&
                          event.type !== "leave" &&
                          "bg-green-50 border-green-400 text-green-800 dark:bg-green-900/20 dark:text-green-200",
                        event.color === "purple" &&
                          event.type !== "leave" &&
                          "bg-purple-50 border-purple-400 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200",
                        event.color === "pink" &&
                          event.type !== "leave" &&
                          "bg-pink-50 border-pink-400 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200",
                      )}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs opacity-75">
                        {new Date(event.start).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(event.end).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      {event.description && <div className="text-xs opacity-75 mt-1">{event.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DayView
