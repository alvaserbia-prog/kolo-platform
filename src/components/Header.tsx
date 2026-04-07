export default function Header() {
  return (
    <header className="h-14 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">
          <span className="font-medium text-gray-900">0</span> POEN
        </span>
        <span className="text-gray-400">•</span>
        <span className="font-medium text-gray-700">pseudonim</span>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          Odjava
        </button>
      </div>
    </header>
  );
}
