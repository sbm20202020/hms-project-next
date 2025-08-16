
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

export const variationPourcentage = (aujourdhui, hier) => {
  if (hier === 0) {
    return aujourdhui > 0 ? 100 : 0; // éviter division par zéro
  }
  return ((aujourdhui - hier) / hier * 100).toFixed(2);
}

export const isForToday = (dateStr) => {
  const date = new Date(dateStr); // dateCreation
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export const isForYesterday = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();

  // On crée la date d'hier
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export function getDayRange(date = new Date()) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

