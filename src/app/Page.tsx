import { Navigate } from 'react-router-dom'

export default function Page(): React.ReactElement {
  return <Navigate to="/index.html" replace />
}