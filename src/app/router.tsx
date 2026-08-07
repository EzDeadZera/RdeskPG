import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { ProtectedRoute } from '@/app/protected-route'
import { LoginPage } from '@/pages/auth/login-page'
import { SignupPage } from '@/pages/auth/signup-page'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page'
import { ResetPasswordPage } from '@/pages/auth/reset-password-page'
import { DashboardPage } from '@/pages/dashboard/dashboard-page'
import { LibraryPage } from '@/pages/library/library-page'
import { CampaignPage } from '@/pages/campaign/campaign-page'
import { CharacterSheetPage } from '@/pages/character-sheet/character-sheet-page'
import { MapPage } from '@/pages/map/map-page'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bibliotecas/:libraryId" element={<LibraryPage />} />
            <Route path="/bibliotecas/:libraryId/campanhas/:campaignId" element={<CampaignPage />} />
            <Route
              path="/bibliotecas/:libraryId/campanhas/:campaignId/personagens/:characterId"
              element={<CharacterSheetPage />}
            />
            <Route
              path="/bibliotecas/:libraryId/campanhas/:campaignId/mapa/:mapId"
              element={<MapPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
