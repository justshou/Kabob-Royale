export default function Navbar() {
  const buttonClasses =
    "px-3 py-2 text-sm font-medium hover:text-yellow-500 transition-colors";
  const buttons = (
    <>
      <button className={buttonClasses}>Home</button>
      <button className={buttonClasses}>Menu</button>
    </>
  );

  return (
    <nav className="bg-stone-900 text-yellow-600 fixed w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">Kabob Royale</div>
          {/* Need to redo this to work on mobile */}
          <div className="hidden md:block">
            <div className="flex ml-10 items-baseline space-x-2">{buttons}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
