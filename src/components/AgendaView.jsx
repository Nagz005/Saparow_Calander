"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

const AgendaView = ({ currentDate, setCurrentDate, events, onEventClick, searchQuery }) => {
  const [viewRange, setViewRange] = useState("week") // week, month, all

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events

    // Filter by date range
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    if (viewRange === "week") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate >= startOfWeek && eventDate <= endOfWeek
      })
    } else if (viewRange === "month") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate >= startOfMonth && eventDate <= endOfMonth
      })
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort by date and time
    return filtered.sort((a, b) => new Date(a.start) - new Date(b.start))
  }, [events, viewRange, searchQuery])

  const groupEventsByDate = (events) => {
    const groups = {}
    events.forEach((event) => {
      const dateKey = new Date(event.start).toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
    })
    return groups
  }

  const eventGroups = groupEventsByDate(filteredAndSortedEvents)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getEventDuration = (start, end) => {
    const duration = (new Date(end) - new Date(start)) / (1000 * 60) // minutes
    if (duration < 60) {
      return `${duration}m`
    } else {
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Agenda Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Agenda
          </h2>
          <div className="flex space-x-2">
            <Button
              variant={viewRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewRange("week")}
            >
              This Week
            </Button>
            <Button
              variant={viewRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewRange("month")}
            >
              This Month
            </Button>
            <Button variant={viewRange === "all" ? "default" : "outline"} size="sm" onClick={() => setViewRange("all")}>
              All Events
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredAndSortedEvents.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Events</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {filteredAndSortedEvents.filter((e) => e.type !== "leave").length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Regular Events</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {filteredAndSortedEvents.filter((e) => e.type === "leave").length}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">Leave Days</div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="overflow-y-auto h-full p-4">
        {Object.keys(eventGroups).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "Try adjusting your search terms" : "No events scheduled for this period"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(eventGroups).map(([dateString, dayEvents]) => (
              <div key={dateString}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sticky top-0 bg-white dark:bg-gray-900 py-2">
                  {formatDate(dateString)}
                </h3>
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                        event.type === "leave" &&
                          "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800",
                        event.color === "blue" &&
                          event.type !== "leave" &&
                          "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800",
                        event.color === "green" &&
                          event.type !== "leave" &&
                          "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800",
                        event.color === "purple" &&
                          event.type !== "leave" &&
                          "bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800",
                        event.color === "pink" &&
                          event.type !== "leave" &&
                          "bg-pink-50 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/20 dark:border-pink-800",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4
                              className={cn(
                                "font-medium",
                                event.type === "leave"
                                  ? "text-red-800 dark:text-red-200"
                                  : "text-gray-900 dark:text-white",
                              )}
                            >
                              {event.title}
                            </h4>
                            {event.type === "leave" && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 rounded-full">
                                Leave
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatTime(event.start)} - {formatTime(event.end)}
                              </span>
                              <span className="text-xs">({getEventDuration(event.start, event.end)})</span>
                            </div>
                          </div>

                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{event.description}</p>
                          )}
                        </div>

                        <div
                          className={cn(
                            "w-3 h-3 rounded-full ml-4 mt-1",
                            event.type === "leave" && "bg-red-500",
                            event.color === "blue" && event.type !== "leave" && "bg-blue-500",
                            event.color === "green" && event.type !== "leave" && "bg-green-500",
                            event.color === "purple" && event.type !== "leave" && "bg-purple-500",
                            event.color === "pink" && event.type !== "leave" && "bg-pink-500",
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgendaView
