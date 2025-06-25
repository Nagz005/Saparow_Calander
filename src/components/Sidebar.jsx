"use client"

import { useState } from "react"
import { Calendar, Filter, Palette, Moon, Sun, Bell, Download, Upload } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

const Sidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  events,
  currentDate,
  setCurrentDate,
  darkMode,
  setDarkMode,
  leaveEvents,
  regularEvents,
  displayDate = currentDate,
}) => {
  const [showMiniCalendar, setShowMiniCalendar] = useState(true)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const displayMonth = displayDate.getMonth()
  const displayYear = displayDate.getFullYear()

  const renderMiniCalendar = () => {
    const firstDay = new Date(displayYear, displayMonth, 1)
    const lastDay = new Date(displayYear, displayMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayYear, displayMonth, day)
      const isToday = date.toDateString() === today.toDateString()
      const hasEvents = events.some((event) => new Date(event.start).toDateString() === date.toDateString())

      days.push(
        <button
          key={day}
          onClick={() => setCurrentDate(date)}
          className={cn(
            "h-8 w-8 text-xs rounded-full flex items-center justify-center transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            isToday && "bg-blue-600 text-white hover:bg-blue-700",
            hasEvents && !isToday && "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
          )}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const getCategoryEventCount = (categoryId) => {
    if (categoryId === "all") return events.length
    return events.filter((event) => event.category === categoryId).length
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
      {/* Mini Calendar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendar
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowMiniCalendar(!showMiniCalendar)}>
            {showMiniCalendar ? "Hide" : "Show"}
          </Button>
        </div>

        {showMiniCalendar && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-center mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {displayDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h4>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div
                  key={index}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 h-8 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderMiniCalendar()}</div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left",
              selectedCategory === "all"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
            )}
          >
            <span className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
              All Events
            </span>
            <span className="text-sm font-medium">{getCategoryEventCount("all")}</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left",
                selectedCategory === category.id
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
              )}
            >
              <span className="flex items-center">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full mr-3",
                    category.color === "blue" && "bg-blue-500",
                    category.color === "green" && "bg-green-500",
                    category.color === "purple" && "bg-purple-500",
                    category.color === "pink" && "bg-pink-500",
                  )}
                ></div>
                {category.name}
              </span>
              <span className="text-sm font-medium">{getCategoryEventCount(category.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Settings
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <span className="flex items-center">
              {darkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <Bell className="h-4 w-4 mr-3" />
            Notifications
          </button>

          {/* <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <Download className="h-4 w-4 mr-3" />
            Export Calendar
          </button>

          <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <Upload className="h-4 w-4 mr-3" />
            Import Calendar
          </button> */}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">This Month</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Events</span>
            <span className="font-medium text-gray-900 dark:text-white">{events.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">This Week</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {
                events.filter((event) => {
                  const eventDate = new Date(event.start)
                  const weekStart = new Date(today)
                  weekStart.setDate(today.getDate() - today.getDay())
                  const weekEnd = new Date(weekStart)
                  weekEnd.setDate(weekStart.getDate() + 6)
                  return eventDate >= weekStart && eventDate <= weekEnd
                }).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
