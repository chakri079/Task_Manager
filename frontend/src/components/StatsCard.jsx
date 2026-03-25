const StatsCard = ({ title, value, icon, valueColorClass = "text-gray-900 dark:text-white" }) => {
  return (
    <div className="card flex items-center p-6 gap-4">
      <div className={`p-4 rounded-xl flex-shrink-0 ${icon.bgColorClasses}`}>
        {icon.component}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
        <p className={`text-3xl font-bold tracking-tight ${valueColorClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
