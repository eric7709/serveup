export default function ActiveRevenue() {
  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      <p>
        Active Orders: <span className="text-amber-600">{0}</span>
      </p>
      <p>
        Revenue: <span className="text-green-500">{0}</span>
      </p>
    </div>
  );
}
