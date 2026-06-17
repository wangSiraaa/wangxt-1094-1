import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import RoutePublish from '@/pages/RoutePublish'
import Registration from '@/pages/Registration'
import FinishRecord from '@/pages/FinishRecord'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RoutePublish />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/finish" element={<FinishRecord />} />
        </Route>
      </Routes>
    </Router>
  )
}
