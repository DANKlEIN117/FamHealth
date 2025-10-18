export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">FamHealth</h1>

      <div className="flex gap-6">
        <a href="/" className="hover:text-gray-200 transition">Home</a>
        <a href="/login" className="hover:text-gray-200 transition">Login</a>
        <a href="/signup" className="hover:text-gray-200 transition">Sign Up</a>
      </div>
    </nav>
  );
}
