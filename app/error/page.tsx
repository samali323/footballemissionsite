export default function ErrorPage() {
  return (
    <div className="container mx-auto p-4 text-red-500">
      <h1 className="text-2xl font-bold">Configuration Error</h1>
      <p>Supabase configuration is missing. Please check your environment variables.</p>
    </div>
  )
}
