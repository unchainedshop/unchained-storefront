export const metadata = {
  title: '404 – Page not found',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="/" className="btn btn-primary">
                Back to the shop
              </a>
              <a href="/search" className="btn btn-secondary">
                Search products
              </a>
            </div>
          </main>
  );
}
