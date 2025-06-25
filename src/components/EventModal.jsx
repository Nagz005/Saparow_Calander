"use client"

import { useState, useEffect } from "react"
import { X, Clock, Tag, FileText, Trash2, Calendar } from "lucide-react"
import { Button } from "./ui/button"

const EventModal = ({ isOpen, onClose, event, onSave, onDelete, categories, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    category: "work",
    color: "blue",
    description: "",
    type: "event", // event or leave
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        start: formatDateTimeLocal(event.start),
        end: formatDateTimeLocal(event.end),
        category: event.category || "work",
        color: event.color || "blue",
        description: event.description || "",
        type: event.type || "event",
      })
    } else if (selectedDate) {
      const startTime = new Date(selectedDate)
      startTime.setHours(9, 0, 0, 0)
      const endTime = new Date(selectedDate)
      endTime.setHours(10, 0, 0, 0)

      setFormData({
        title: "",
        start: formatDateTimeLocal(startTime),
        end: formatDateTimeLocal(endTime),
        category: "work",
        color: "blue",
        description: "",
        type: "event",
      })
    }
  }, [event, selectedDate])

  const formatDateTimeLocal = (date) => {
    const d = new Date(date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const eventData = {
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
    }

    // If it's a leave day, set it for the full day
    if (formData.type === "leave") {
      const startDate = new Date(formData.start)
      const endDate = new Date(formData.start)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      eventData.start = startDate
      eventData.end = endDate
      eventData.color = "red"
    }

    if (event) {
      onSave(event.id, eventData)
    } else {
      onSave(eventData)
    }
    onClose()
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
      onClose()
    }
  }

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type })
    if (type === "leave") {
      // Set default leave day times
      const startDate = new Date(formData.start)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(formData.start)
      endDate.setHours(23, 59, 59, 999)
      setFormData({
        ...formData,
        type,
        start: formatDateTimeLocal(startDate),
        end: formatDateTimeLocal(endDate),
        color: "red",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event ? "Edit Event" : "Create Event"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="event"
                  checked={formData.type === "event"}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Regular Event</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="leave"
                  checked={formData.type === "leave"}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Leave Day</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              {formData.type === "leave" ? "Leave Reason" : "Title"}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={formData.type === "leave" ? "Vacation, Sick leave, etc." : "Event title"}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-2" />
                Start
              </label>
              <input
                type={formData.type === "leave" ? "date" : "datetime-local"}
                required
                value={formData.type === "leave" ? formData.start.split("T")[0] : formData.start}
                onChange={(e) => {
                  if (formData.type === "leave") {
                    const date = new Date(e.target.value)
                    date.setHours(0, 0, 0, 0)
                    setFormData({ ...formData, start: formatDateTimeLocal(date) })
                  } else {
                    setFormData({ ...formData, start: e.target.value })
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-2" />
                End
              </label>
              <input
                type={formData.type === "leave" ? "date" : "datetime-local"}
                required
                value={formData.type === "leave" ? formData.end.split("T")[0] : formData.end}
                onChange={(e) => {
                  if (formData.type === "leave") {
                    const date = new Date(e.target.value)
                    date.setHours(23, 59, 59, 999)
                    setFormData({ ...formData, end: formatDateTimeLocal(date) })
                  } else {
                    setFormData({ ...formData, end: e.target.value })
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category (only for regular events) */}
          {formData.type === "event" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="inline h-4 w-4 mr-2" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const category = categories.find((c) => c.id === e.target.value)
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    color: category?.color || "blue",
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.type === "leave" ? "Additional Notes" : "Description"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={formData.type === "leave" ? "Additional notes (optional)" : "Event description (optional)"}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {event && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {event ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
