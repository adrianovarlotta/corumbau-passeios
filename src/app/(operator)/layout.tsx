export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-lg mx-auto px-4 py-4">{children}</main>
    </div>
  )
}
