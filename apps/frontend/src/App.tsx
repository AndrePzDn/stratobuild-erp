import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/Login/LoginPage";
import HomePage from "./pages/Home/HomePage";
import ClientPage from "./pages/Client/ClientPage";
import ResourcePage from "./pages/Resource/ResourcePage";
import UnitOfMeasurementPage from "./pages/UnitOfMeasurement/UnitOfMeasurementPage";
import ProviderPage from "./pages/Provider/ProviderPage";
import BankPricePage from "./pages/BankPrice/BankPricePage";
import CurrencyPage from "./pages/Currency/CurrencyPage";
import QuotePage from "./pages/Quote/QuotePage";
import BudgetPage from "./pages/Budget/BudgetPage";
import ProjectPage from "./pages/Project/ProjectPage";
import PlanningPage from "./pages/Planning/PlanningPage";
import PaymentsPage from "./pages/Payments/PaymentsPage";
import TaxesPage from "./pages/TaxesPage/TaxesPage";
import ProjectServicePage from "./pages/ProjectService/ProjectServicePage";
import ProjectCategoryPage from "./pages/ProjectCategory/ProjectCategoryPage";
import UsersPage from "./pages/Users/UsersPage";
import UpdatePasswordPage from "./pages/UpdatePassword/UpdatePasswordPage";
import CertificationPage from "./pages/Certification/CertificationPage";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/service/project" element={<ProjectServicePage />} />
            <Route path="/category/project" element={<ProjectCategoryPage />} />
            <Route path="/project/list/:page" element={<ProjectPage />} />
            <Route path="/project/planning/:id" element={<PlanningPage />} />
            <Route path="/project/payments/:id" element={<PaymentsPage />} />
            <Route path="/project/certifications/:id" element={<CertificationPage />} />
            <Route path="/customer" element={<ClientPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/invoice" element={<>Hola</>} />
            <Route path="/taxes" element={<TaxesPage />} />
            <Route path="/currencies" element={<CurrencyPage />} />
            <Route path="/bank-price" element={<BankPricePage />} />
            <Route path="/resources" element={<ResourcePage />} />
            <Route path="/UOM" element={<UnitOfMeasurementPage />} />
            <Route path="/providers" element={<ProviderPage />} />
            <Route path="/admin-users" element={<UsersPage />} />
            <Route path="/settings" element={<>Hola</>} />
            <Route path="/about" element={<>Hola</>} />
          </Route>
        </Routes>
        <ToastContainer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
