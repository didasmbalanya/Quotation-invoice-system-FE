import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";

import Quotations from "./pages/Quotations.jsx";
import NewQuotation from "./pages/NewQuotation.jsx";
import Invoices from "./pages/Invoices.jsx";
import QuotationDetails from "./pages/QuotationDetails.jsx";
import EditQuotation from "./pages/EditQuotation.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Quotations />} />
            <Route path="/quotation/new" element={<NewQuotation />} />
            <Route path="/quotation/edit/:id" element={<EditQuotation />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/quotation/:id" element={<QuotationDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
