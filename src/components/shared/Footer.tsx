export function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Taskify. All rights reserved.</p>
      </div>
    </footer>
  );
}
