"use client"

import { useState, useEffect } from "react"
import { useCalendar } from "../hooks/useCalendar"
import CalendarHeader from "./CalendarHeader"
import MonthView from "./MonthView"
import Sidebar from "./Sidebar"
import EventModal from "./EventModal"

const SmartCalendar = () => {
  const {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    events,
    draggedEvent,
    setDraggedEvent,
    isCreatingEvent,
    setIsCreatingEvent,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getFilteredEvents,
  } = useCalendar()

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setShowEventModal(true)
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handleEventSave = (eventIdOrData, eventData) => {
    if (typeof eventIdOrData === "object") {
      // Creating new event
      addEvent(eventIdOrData)
    } else {
      // Updating existing event
      updateEvent(eventIdOrData, eventData)
    }
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const handleEventDelete = (eventId) => {
    deleteEvent(eventId)
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const handleEventDrop = (event, newDate) => {
    const timeDiff = newDate.getTime() - new Date(event.start).getTime()
    const newStart = new Date(event.start.getTime() + timeDiff)
    const newEnd = new Date(event.end.getTime() + timeDiff)

    updateEvent(event.id, {
      start: newStart,
      end: newEnd,
    })
  }

  const filteredEvents = getFilteredEvents()

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateEvent={handleCreateEvent}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          events={filteredEvents}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 overflow-hidden">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={filteredEvents}
              getEventsForDate={getEventsForDate}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
              onEventDrop={handleEventDrop}
            />
          )}
        </div>
      </div>

      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        categories={categories}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default SmartCalendar
