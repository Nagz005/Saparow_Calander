"use client"

import { useState, useCallback } from "react"

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState("month") // month, week, day, agenda
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      start: new Date(2024, 11, 25, 10, 0),
      end: new Date(2024, 11, 25, 11, 0),
      category: "work",
      color: "blue",
      description: "Weekly team sync",
    },
    {
      id: 2,
      title: "Lunch with Sarah",
      start: new Date(2024, 11, 26, 12, 30),
      end: new Date(2024, 11, 26, 13, 30),
      category: "personal",
      color: "green",
      description: "Catch up over lunch",
    },
    {
      id: 3,
      title: "Project Deadline",
      start: new Date(2024, 11, 28, 9, 0),
      end: new Date(2024, 11, 28, 17, 0),
      category: "work",
      color: "red",
      description: "Final project submission",
    },
  ])
  const [draggedEvent, setDraggedEvent] = useState(null)
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "work", name: "Work", color: "blue" },
    { id: "personal", name: "Personal", color: "green" },
    { id: "health", name: "Health", color: "purple" },
    { id: "social", name: "Social", color: "pink" },
  ]

  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    }
    setEvents((prev) => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((eventId, updates) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...updates } : event)))
  }, [])

  const deleteEvent = useCallback((eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }, [])

  const getEventsForDate = useCallback(
    (date) => {
      return events.filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate.toDateString() === date.toDateString()
      })
    },
    [events],
  )

  const getFilteredEvents = useCallback(() => {
    let filtered = events

    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [events, selectedCategory, searchQuery])

  return {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    events,
    setEvents,
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
  }
}
