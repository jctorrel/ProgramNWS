// client/src/components/ModuleProgressBars.jsx

const TimelineMonths = ({ months }) => {
  return (
    <div className="w-full mb-4">
      {/* Conteneur principal : C'est lui qui définit les limites globales */}
      <div className="w-full border border-slate-200 rounded-lg overflow-hidden flex shadow-sm">

        {months.map((month, idx) => {
          // Date actuelle pour comparaison
          const date = new Date();
          let currentMonthIndex = date.getMonth();
          currentMonthIndex = currentMonthIndex >= 9 ? currentMonthIndex - 8 : currentMonthIndex + 4;

          // Logique d'état stricte
          const isPast = idx < currentMonthIndex;
          const isCurrent = idx === currentMonthIndex;


          return (
            <div
              key={idx}
              className={`
                flex-1 flex flex-col items-center justify-center
                border-r border-slate-300 last:border-r-0
                ${isPast ? 'bg-nws-purple text-white' : ''}
                ${isCurrent ? 'bg-white text-nws-purple' : ''}
                ${!isPast && !isCurrent ? 'bg-purple-100 text-slate-500' : ''}
              `}
            >
              {/* Le Label */}
              <span className="text-xs uppercase tracking-wider z-10">
                {month.name}
              </span>

              {/* Indicateur pour le mois courant */}
              {isCurrent && (
                <div className="mt-1 leading-none bg-nws-purple text-white px-2 py-0.5 rounded-full">
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TimelineMonths;