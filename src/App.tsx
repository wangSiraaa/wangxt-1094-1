import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import RoutePublish from '@/pages/RoutePublish'
import Registration from '@/pages/Registration'
import FinishRecord from '@/pages/FinishRecord'
import Archive from '@/pages/Archive'
import Dashboard from '@/pages/Dashboard'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/routes" element={<RoutePublish />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/finish" element={<FinishRecord />} />
          <Route path="/archive" element={<Archive />} />
        </Route>
      </Routes>
    </Router>
  )
}
