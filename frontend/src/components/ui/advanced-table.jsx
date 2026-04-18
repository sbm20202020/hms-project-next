"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react"

export default function AdvancedTable({
  title,
  data = [],
  columns = [],
  searchable = true,
  filterable = true,
  sortable = true,
  groupable = false,
  exportable = true,
  actions = [],
  pageSize = 10,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({})
  const [groupBy, setGroupBy] = useState("none")
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize)

  const filteredData = useMemo(() => {
    let filtered = data

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          const value = item[column.key]
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        }),
      )
    }

    // Column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        filtered = filtered.filter((item) => item[key] === value)
      }
    })

    return filtered
  }, [data, searchTerm, filters, columns])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  const groupedData = useMemo(() => {
    if (!groupBy || groupBy === "none") return { "": sortedData }

    return sortedData.reduce((groups, item) => {
      const key = item[groupBy] || "Non défini"
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    }, {})
  }, [sortedData, groupBy])

  const paginatedData = useMemo(() => {
    if (!groupBy || groupBy === "none") {
      const startIndex = (currentPage - 1) * selectedPageSize
      return sortedData.slice(startIndex, startIndex + selectedPageSize)
    }
    return groupedData
  }, [sortedData, groupedData, currentPage, selectedPageSize, groupBy])

  const totalPages = Math.ceil(sortedData.length / selectedPageSize)

  const handleSort = (key) => {
    if (!sortable) return

    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />
    return sortConfig.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getUniqueValues = (key) => {
    return [...new Set(data.map((item) => item[key]).filter(Boolean))]
  }

  const exportData = () => {
    const csv = [
      columns.map((col) => col.header).join(","),
      ...sortedData.map((row) => columns.map((col) => row[col.key] || "").join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "data"}.csv`
    a.click()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <CardTitle>{title}</CardTitle>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}

            {groupable && (
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Grouper par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun groupement</SelectItem>
                  {columns
                    .filter((col) => col.groupable)
                    .map((col) => (
                      <SelectItem key={col.key} value={col.key}>
                        {col.header}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            {exportable && (
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            )}
          </div>
        </div>

        {filterable && (
          <div className="flex flex-wrap gap-4 mt-4">
            {columns
              .filter((col) => col.filterable)
              .map((col) => (
                <div key={col.key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">{col.filterLabel || col.header}</label>
                  <Select
                    value={filters[col.key] || "all"}
                    onValueChange={(value) => handleFilterChange(col.key, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={`Filtrer ${col.header}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {getUniqueValues(col.key).map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {sortedData.length} résultat{sortedData.length > 1 ? "s" : ""} trouvé{sortedData.length > 1 ? "s" : ""}
          </p>

          <Select
            value={selectedPageSize.toString()}
            onValueChange={(value) => {
              setSelectedPageSize(Number.parseInt(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 par page</SelectItem>
              <SelectItem value="10">10 par page</SelectItem>
              <SelectItem value="25">25 par page</SelectItem>
              <SelectItem value="50">50 par page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {groupBy !== "none" ? (
          <div className="space-y-6">
            {Object.entries(groupedData).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  {group} ({items.length})
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.key}>{column.header}</TableHead>
                      ))}
                      {actions.length > 0 && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={column.key}>
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell>
                            <div className="flex space-x-2">
                              {actions.map((action, actionIndex) => (
                                <Button key={actionIndex} variant="ghost" size="sm" onClick={() => action.onClick(row)}>
                                  {action.icon}
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={sortable && column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {sortable && column.sortable && getSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {actions.map((action, actionIndex) => (
                          <Button key={actionIndex} variant="ghost" size="sm" onClick={() => action.onClick(row)}>
                            {action.icon}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {groupBy === "none" && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </p>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
