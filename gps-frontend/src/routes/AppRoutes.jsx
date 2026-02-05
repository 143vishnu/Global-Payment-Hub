import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PageNotFound from '../components/common/PageNotFound';
import Unauthorized from '../components/common/Unauthorized';
import Layout from '../components/layout/Layout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PaymentSearchPage from '../pages/PaymentSearchPage';
import PaymentDetailsPage from '../pages/PaymentDetailsPage';
import BulkPaymentPage from '../pages/BulkPaymentPage';
import PaymentCalculatorPage from '../pages/PaymentCalculatorPage';
import PaymentTemplatesPage from '../pages/PaymentTemplatesPage';
import PaymentHealthScorePage from '../pages/PaymentHealthScorePage';
import SmartRetryPage from '../pages/SmartRetryPage';
import PaymentTimelinePage from '../pages/PaymentTimelinePage';
import OpsHandoverPage from '../pages/OpsHandoverPage';
import PaymentDNAPage from '../pages/PaymentDNAPage';
import RootCausePage from '../pages/RootCausePage';
import OpsLoadBalancerPage from '../pages/OpsLoadBalancerPage';
import RevenueLeakagePage from '../pages/RevenueLeakagePage';
import WhatIfSimulatorPage from '../pages/WhatIfSimulatorPage';
import PaymentBottleneckPage from '../pages/PaymentBottleneckPage';
import SLAConfidencePage from '../pages/SLAConfidencePage';
import PaymentCorridorPage from '../pages/PaymentCorridorPage';
import CustomerExperiencePage from '../pages/CustomerExperiencePage';
import RegulatoryRiskPage from '../pages/RegulatoryRiskPage';
import SeasonalityPage from '../pages/SeasonalityPage';
import RuleChangeImpactPage from '../pages/RuleChangeImpactPage';
import ConfigVersioningPage from '../pages/ConfigVersioningPage';
import TimeBoundRulesPage from '../pages/TimeBoundRulesPage';
import ShadowModePage from '../pages/ShadowModePage';
import BlastRadiusPage from '../pages/BlastRadiusPage';
import FailSafeModePage from '../pages/FailSafeModePage';
import ConfigDriftPage from '../pages/ConfigDriftPage';
import OperationalDebtPage from '../pages/OperationalDebtPage';
import ExceptionPage from '../pages/ExceptionPage';
import ReportsPage from '../pages/ReportsPage';
import AdminPage from '../pages/AdminPage';
import { ROLES } from '../utils/constants';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - All authenticated users */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Payment Routes - Ops User, Admin */}
          <Route
            path="/payments"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <PaymentSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments/:id"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <PaymentDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Bulk Payment - Ops User, Admin */}
          <Route
            path="/bulk"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <BulkPaymentPage />
              </ProtectedRoute>
            }
          />

          {/* Payment Calculator - All authenticated users */}
          <Route path="/calculator" element={<PaymentCalculatorPage />} />

          {/* Payment Templates - Ops User, Admin */}
          <Route
            path="/templates"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <PaymentTemplatesPage />
              </ProtectedRoute>
            }
          />

          {/* Control Tower Features - Ops User, Admin */}
          <Route
            path="/health-score"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <PaymentHealthScorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smart-retry"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <SmartRetryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <PaymentTimelinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/handover"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <OpsHandoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dna-analyzer"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <PaymentDNAPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/root-cause"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <RootCausePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/load-balancer"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <OpsLoadBalancerPage />
              </ProtectedRoute>
            }
          />

          {/* Exception Handling - Ops User, Admin */}
          <Route
            path="/exceptions"
            element={
              <ProtectedRoute requiredRoles={[ROLES.OPS_USER, ROLES.ADMIN]}>
                <ExceptionPage />
              </ProtectedRoute>
            }
          />

          {/* Reports - All authenticated users */}
          <Route path="/reports" element={<ReportsPage />} />

          {/* Business Intelligence Features - Business User, Admin */}
          <Route
            path="/revenue-leakage"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <RevenueLeakagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/what-if-simulator"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <WhatIfSimulatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bottleneck-map"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <PaymentBottleneckPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sla-confidence"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <SLAConfidencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-corridor"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <PaymentCorridorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-experience"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <CustomerExperiencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulatory-risk"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <RegulatoryRiskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seasonality"
            element={
              <ProtectedRoute requiredRoles={[ROLES.BUSINESS_USER, ROLES.ADMIN]}>
                <SeasonalityPage />
              </ProtectedRoute>
            }
          />

          {/* Admin - Admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Admin/Platform Owner Features - Admin only */}
          <Route
            path="/rule-change-impact"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <RuleChangeImpactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/config-versioning"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <ConfigVersioningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/time-bound-rules"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <TimeBoundRulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shadow-mode"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <ShadowModePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blast-radius"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <BlastRadiusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fail-safe-mode"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <FailSafeModePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/config-drift"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <ConfigDriftPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operational-debt"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                <OperationalDebtPage />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
