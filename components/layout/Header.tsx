import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">
            AssessHub
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/assessments"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Assessments
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
