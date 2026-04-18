"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronDown, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Sélectionner une option",
  className,
  emptyText = "Aucun résultat trouvé",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOption, setSelectedOption] = useState(null)
  const selectRef = useRef(null)

  // Mettre à jour l'option sélectionnée quand value change
  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value)
      setSelectedOption(option || null)
    } else {
      setSelectedOption(null)
    }
  }, [value, options])

  // Fermer dropdown au clic en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        !event.target.closest(".modal") // Si ton modal a cette classe
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Auto-focus input quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        selectRef.current?.querySelector("input")?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelect = (option) => {
    setSelectedOption(option)
    onChange?.(option.value)
    setIsOpen(false)
    setSearchTerm("")
  }

  const clearSelection = (e) => {
    e.stopPropagation()
    setSelectedOption(null)
    onChange?.("")
  }

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      {/* Sélecteur */}
      <div
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md cursor-pointer",
          "bg-white border-input ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 overflow-hidden">
          {selectedOption ? (
            <div className="flex flex-col">
              <span className="font-medium truncate">{selectedOption.label}</span>
              {selectedOption.description && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedOption.description}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center ml-2">
          {selectedOption && (
            <button
              type="button"
              onClick={clearSelection}
              className="p-1 mr-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", {
            "transform rotate-180": isOpen,
          })} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
  className="absolute z-[2000] w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg border-input"
  onClick={(e) => e.stopPropagation()}
>
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className="w-full py-2 pl-10 pr-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={cn(
                      "relative px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      selectedOption?.value === option.value && "bg-accent/50"
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                      {selectedOption?.value === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-sm text-center text-muted-foreground">
                {emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
