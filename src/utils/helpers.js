
export const calculerAge = (dateNaissance) => {
  const aujourdHui = new Date();
  const naissance = new Date(dateNaissance);
  let age = aujourdHui.getFullYear() - naissance.getFullYear();
  const m = aujourdHui.getMonth() - naissance.getMonth();
  if (m < 0 || (m === 0 && aujourdHui.getDate() < naissance.getDate())) {
    age--;
  }
  return age;
}

export const generateCode = (prefix, increment) => {
  try {
    const now = new Date()
    const dateStr = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    }).replace(/\//g, "")

    const timeStr = now.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit",
      hour12: false 
    }).replace(/:/g, "")

    const incrementStr = increment.toString().padStart(3, "0")

    const code = `${prefix}-${dateStr}-${timeStr}-${incrementStr}`
    console.log("code", code)

    return code;
  } catch (error) {
    console.error("Erreur lors de la génération du code:", error)
    return null
  }
} 

export const getTimeInDateTime = (date) => {
  const now = new Date(date);
  return now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};
