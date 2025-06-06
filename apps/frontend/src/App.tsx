import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import Example from "./Example";
import PlanningPage from "./pages/Planning/PlanningPage";
import PaymentsPage from "./pages/Payments/PaymentsPage";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/test" element={<Example />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/certification" element={<>Hola</>} />
            <Route path="/service/project" element={<>Hola</>} />
            <Route path="/category/project" element={<>Hola</>} />
            <Route path="/project/list/:page" element={<ProjectPage />} />
            <Route path="/project/planning/:id" element={<PlanningPage />} />
            <Route path="/project/payments/:id" element={<PaymentsPage />} />
            <Route path="/customer" element={<ClientPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/invoice" element={<>Hola</>} />
            <Route path="/taxes" element={<>Hola</>} />
            <Route path="/currencies" element={<CurrencyPage />} />
            <Route path="/bank-price" element={<BankPricePage />} />
            <Route path="/resources" element={<ResourcePage />} />
            <Route path="/UOM" element={<UnitOfMeasurementPage />} />
            <Route path="/providers" element={<ProviderPage />} />
            <Route path="/admin-users" element={<>Hola</>} />
            <Route path="/settings" element={<>Hola</>} />
            <Route path="/about" element={<>Hola</>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
