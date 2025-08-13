class LocalDatabase {
  constructor() {
    this.initializeData()
  }

  // Initialize data from JSON file if localStorage is empty
  async initializeData() {
    if (!localStorage.getItem("hms_data")) {
      try {
        const response = await fetch("/data/database.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        localStorage.setItem("hms_data", JSON.stringify(data))
      } catch (error) {
        console.error("Error loading initial data:", error)
        const fallbackData = {
          patients: [
            {
              id: 1,
              nom: "Exemple",
              prenom: "Patient",
              dateNaissance: "1990-01-01",
              telephone: "01 23 45 67 89",
              email: "patient@exemple.com",
              adresse: "123 Rue Exemple",
              ville: "Paris",
              codePostal: "75001",
              sexe: "Masculin",
              statut: "Actif",
              numeroSecu: "1900101123456",
              assurance: "CNSS",
              medecinTraitant: "Dr. Exemple",
              service: "Médecine Générale",
              dateCreation: new Date().toISOString().split("T")[0],
              derniereVisite: new Date().toISOString().split("T")[0],
            },
          ],
          doctors: [
            {
              id: 1,
              nom: "Exemple",
              prenom: "Dr. Médecin",
              specialite: "Médecine Générale",
              telephone: "01 23 45 67 89",
              email: "medecin@hopital.com",
              statut: "Actif",
              numeroOrdre: "12345678",
              experience: "10 ans",
              horaires: "Lun-Ven 8h-18h",
              patients: 25,
              dateEmbauche: "2014-01-01",
            },
          ],
          appointments: [],
          factures: [],
          chambres: [],
          soins: [],
        }
        localStorage.setItem("hms_data", JSON.stringify(fallbackData))
      }
    }
  }

  // Get all data
  getAllData() {
    const data = localStorage.getItem("hms_data")
    return data ? JSON.parse(data) : {}
  }

  // Get data by table name
  getTable(tableName) {
    const allData = this.getAllData()
    return allData[tableName] || []
  }

  // Save data to localStorage
  saveData(data) {
    localStorage.setItem("hms_data", JSON.stringify(data))
  }

  // Add new record
  add(tableName, record) {
    const allData = this.getAllData()
    if (!allData[tableName]) {
      allData[tableName] = []
    }

    // Generate new ID
    const maxId = allData[tableName].length > 0 ? Math.max(...allData[tableName].map((item) => item.id || 0)) : 0

    record.id = maxId + 1
    record.dateCreation = new Date().toISOString().split("T")[0]

    allData[tableName].push(record)
    this.saveData(allData)
    return record
  }

  // Update record
  update(tableName, id, updates) {
    const allData = this.getAllData()
    const table = allData[tableName] || []
    const index = table.findIndex((item) => item.id === id)

    if (index !== -1) {
      table[index] = { ...table[index], ...updates, dateModification: new Date().toISOString().split("T")[0] }
      this.saveData(allData)
      return table[index]
    }
    return null
  }

  // Delete record
  delete(tableName, id) {
    const allData = this.getAllData()
    const table = allData[tableName] || []
    const filteredTable = table.filter((item) => item.id !== id)

    allData[tableName] = filteredTable
    this.saveData(allData)
    return true
  }

  // Search records
  search(tableName, searchTerm, fields = []) {
    const table = this.getTable(tableName)
    if (!searchTerm) return table

    return table.filter((item) => {
      if (fields.length === 0) {
        // Search in all string fields
        return Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        )
      } else {
        // Search in specific fields
        return fields.some(
          (field) => item[field] && item[field].toString().toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }
    })
  }

  // Filter records
  filter(tableName, filters) {
    const table = this.getTable(tableName)

    return table.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all") return true
        return item[key] === value
      })
    })
  }

  // Get statistics
  getStats(tableName) {
    const table = this.getTable(tableName)
    return {
      total: table.length,
      recent: table.filter((item) => {
        const itemDate = new Date(item.dateCreation || item.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return itemDate >= weekAgo
      }).length,
    }
  }
}

// Export singleton instance
export const db = new LocalDatabase()
export default db
