"use client"

import { ChevronLeft, ChevronRight, Calendar, Grid, List, Clock, Search, Plus, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import DateFilter from "./DateFilter"

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  view,
  setView,
  searchQuery,
  setSearchQuery,
  onCreateEvent,
  onToggleSettings,
}) => {
  const [showDateFilter, setShowDateFilter] = useState(false)

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatHeaderDate = () => {
    const options = { year: "numeric", month: "long" }
    return currentDate.toLocaleDateString("en-US", options)
  }

  const viewButtons = [
    { id: "month", icon: Grid, label: "Month" },
    { id: "week", icon: Calendar, label: "Week" },
    { id: "day", icon: Clock, label: "Day" },
    { id: "agenda", icon: List, label: "Agenda" },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Calendar</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" onClick={() => setShowDateFilter(true)}>
              Go to Date
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 ml-4">{formatHeaderDate()}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Create Event */}
          <Button onClick={onCreateEvent} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>

          {/* Settings */}
          <Button variant="outline" size="icon" onClick={onToggleSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex items-center space-x-2">
        {viewButtons.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={view === id ? "default" : "outline"}
            size="sm"
            onClick={() => setView(id)}
            className="flex items-center space-x-2"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
      {showDateFilter && (
        <DateFilter
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onClose={() => setShowDateFilter(false)}
        />
      )}
    </div>
  )
}

export default CalendarHeader
