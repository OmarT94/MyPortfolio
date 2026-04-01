import { Routes, Route, Navigate } from 'react-router-dom'

const PlaceholderPage = ({ name }: { name: string }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-slate-100">{name}</h1>
        <p className="text-slate-400 mt-2">قيد الإنشاء</p>
      </div>
    </div>
)

function App() {
  return (
      <Routes>
        <Route path="/"            element={<PlaceholderPage name="Home Page" />} />
        <Route path="/view/:token" element={<PlaceholderPage name="Company View" />} />
        <Route path="/admin/login"     element={<PlaceholderPage name="Admin Login" />} />
        <Route path="/admin/dashboard" element={<PlaceholderPage name="Admin Dashboard" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default App