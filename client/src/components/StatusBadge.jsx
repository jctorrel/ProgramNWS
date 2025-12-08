// client/src/components/StatusBadge.jsx
import React from "react";

function StatusBadge({ online = false, count = 0, limit = 0 }) {
  // Si count et limit sont tous les deux 0, on est probablement en chargement
  const isLoading = count === 0 && limit === 0 && !online;

  if (isLoading) {
    return (
      <div className="ml-auto hidden sm:flex flex-col items-end gap-1 text-[9px] text-gray-500">
        <span className="px-2 py-[3px] rounded-full border border-indigo-300/70 bg-white/90 inline-flex items-center gap-1.5 text-gray-600">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse" />
          Chargement...
        </span>
      </div>
    );
  }

  const isAtLimit = count >= limit;
  const isNearLimit = count >= limit * 0.85; // À 85% de la limite

  // Déterminer le label et le style
  let statusLabel, badgeColor, textColor;

  if (!online) {
    statusLabel = "Hors ligne";
    badgeColor = "bg-red-500";
    textColor = "text-red-700";
  } else if (isAtLimit) {
    statusLabel = "Limite atteinte";
    badgeColor = "bg-red-500";
    textColor = "text-red-700";
  } else if (isNearLimit) {
    statusLabel = "En ligne (/!\\ Limite proche)";
    badgeColor = "bg-orange-500";
    textColor = "text-orange-700";
  } else {
    statusLabel = "En ligne";
    badgeColor = "bg-green-500";
    textColor = "text-green-700";
  }

  return (
    <div className="ml-auto hidden sm:flex flex-col items-end gap-1 text-[9px] text-gray-500">
      <span className={`px-2 py-[3px] rounded-full border border-indigo-300/70 bg-white/90 inline-flex items-center gap-1.5 ${textColor}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
        {statusLabel} <small>({count}/{limit})</small>
      </span>
    </div>
  );
}

export default StatusBadge;