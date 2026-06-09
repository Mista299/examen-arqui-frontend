import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { StudentsPage } from "@/features/students/pages/students-page"
import { SubjectsPage } from "@/features/subjects/pages/subjects-page"
import { RegisterGradesPage } from "@/features/grades/pages/register-grades-page"
import StudentGradesPage from "@/features/grades/pages/student-grades-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/grades/register" element={<RegisterGradesPage />} />
          <Route path="/grades/query" element={<StudentGradesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}