import { createBrowserRouter, Navigate } from 'react-router-dom'

import AppLayout               from '@/layouts/AppLayout'

// Auth / Onboarding
import LoginPage               from '@/modules/auth/onboarding/LoginPage'
import SignUpPage              from '@/modules/auth/onboarding/SignUpPage'
import ForgotPasswordPage      from '@/modules/auth/onboarding/ForgotPasswordPage'

// Dashboard
import DashboardPage           from '@/modules/dashboard/DashboardPage'
import RecentActivity          from '@/modules/dashboard/sections/RecentActivity'
import AttentionDetail         from '@/modules/dashboard/sections/AttentionDetail'

// Hiring
import HiringPage              from '@/modules/hiring/HiringPage'
import PostGigV3Page           from '@/modules/hiring/post-gig-v3/PostGigV3Page'
import GigDetailPage           from '@/modules/hiring/gig-detail/GigDetailPage'
import OverviewTab             from '@/modules/hiring/gig-detail/tabs/OverviewTab'
import ApplicationsTab         from '@/modules/hiring/gig-detail/tabs/ApplicationsTab'
import AgreementTab            from '@/modules/hiring/gig-detail/tabs/AgreementTab'
import PaymentTab              from '@/modules/hiring/gig-detail/tabs/PaymentTab'
import ActivityLogTab          from '@/modules/hiring/gig-detail/tabs/ActivityLogTab'

// Finance
import FinancePage             from '@/modules/finance/FinancePage'
import TransactionsView        from '@/modules/finance/TransactionsView'
import InvoicesView            from '@/modules/finance/InvoicesView'
import RefundsView             from '@/modules/finance/RefundsView'

// Organisation
import OrganisationPage        from '@/modules/organisation/OrganisationPage'

export const router = createBrowserRouter([
  // ── Auth (standalone, no AppLayout) ──
  { path: 'login',           element: <LoginPage /> },
  { path: 'sign-up',         element: <SignUpPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Default redirect
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // ── Dashboard ──
      { path: 'dashboard',           element: <DashboardPage /> },
      { path: 'dashboard/recent',    element: <RecentActivity /> },
      { path: 'dashboard/attention', element: <AttentionDetail /> },

      // ── Hiring ──
      { path: 'hiring',     element: <HiringPage /> },
      { path: 'hiring/new', element: <PostGigV3Page /> },
      {
        path: 'hiring/:gigId',
        element: <GigDetailPage />,
        children: [
          { index: true,               element: <Navigate to="overview" replace /> },
          { path: 'overview',          element: <OverviewTab /> },
          { path: 'applications',      element: <ApplicationsTab /> },
          { path: 'agreement',         element: <AgreementTab /> },
          { path: 'payment',           element: <PaymentTab /> },
          { path: 'activity',          element: <ActivityLogTab /> },
        ],
      },

      // ── Finance ──
      {
        path: 'finance',
        element: <FinancePage />,
        children: [
          { index: true,          element: <Navigate to="transactions" replace /> },
          { path: 'transactions', element: <TransactionsView /> },
          { path: 'invoices',     element: <InvoicesView /> },
          { path: 'refunds',      element: <RefundsView /> },
        ],
      },

      // ── Organisation ──
      { path: 'organisation', element: <OrganisationPage /> },
    ],
  },
], { basename: '/employer-web' })
