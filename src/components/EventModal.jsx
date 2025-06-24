"use client"

import { useState, useEffect } from "react"
import { X, Clock, Tag, FileText, Trash2 } from "lucide-react"
import { Button } from "./ui/button"

const EventModal = ({ isOpen, onClose, event, onSave, onDelete, categories, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    category: "work",
    color: "blue",
    description: "",
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event ? "Edit Event" : "Create Event"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event title"
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
                type="datetime-local"
                required
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-2" />
                End
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event description (optional)"
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
