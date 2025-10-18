// Simple rule-based AI system

export const analyzeHealth = (member) => {
  const suggestions = [];
  const alerts = [];

  // ---- Age-based checkups ----
  if (member.age < 12) {
    suggestions.push("Regular pediatric checkup every 6 months.");
  } else if (member.age >= 12 && member.age < 40) {
    suggestions.push("Annual full-body checkup recommended.");
  } else if (member.age >= 40) {
    suggestions.push("Bi-annual blood pressure and sugar level checkup advised.");
  }

  // ---- Gender-based notes ----
  if (member.gender?.toLowerCase() === "female" && member.age >= 25) {
    suggestions.push("Annual cervical screening (Pap test) recommended.");
  }

  // ---- Health history-based alerts ----
  if (member.healthHistory?.toLowerCase().includes("asthma")) {
    alerts.push("Asthma season alert: avoid dusty areas and keep inhaler handy.");
    suggestions.push("Consider preventive inhaler check with doctor.");
  }

  if (member.healthHistory?.toLowerCase().includes("diabetes")) {
    alerts.push("Check glucose levels regularly.");
    suggestions.push("Maintain low-sugar diet and avoid processed foods.");
  }

  if (member.healthHistory?.toLowerCase().includes("hypertension")) {
    alerts.push("Monitor blood pressure daily.");
    suggestions.push("Avoid high-salt diet and excessive caffeine.");
  }

  // ---- General health trend alert ----
  alerts.push("Flu season alert: consider flu vaccine if not yet taken.");

  // ---- Medication advice (generalized safe meds) ----
  const cheapMedics = [];
  if (member.healthHistory?.toLowerCase().includes("fever")) {
    cheapMedics.push("Paracetamol 500mg (if not allergic)");
  }
  if (member.healthHistory?.toLowerCase().includes("flu")) {
    cheapMedics.push("Cetirizine for mild symptoms");
  }

  return {
    name: member.name,
    age: member.age,
    gender: member.gender,
    alerts,
    suggestions,
    cheapMedics,
    note: "Always consult your family doctor for confirmation before medication."
  };
};
