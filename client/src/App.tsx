import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import "./css/app.css";

const POS = React.lazy(() => import("./pages/POS"));
const Orders = React.lazy(() => import("./pages/Orders"));

// Icon components (SVG)
const IconPOS = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const IconOrders = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const Loading = () => (
  <div className="app-loading-container">
    <div className="app-spinner"></div>
    <span>Đang tải dữ liệu...</span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <nav className="app-nav">
            {/* Logo / Brand Name */}
            <Link to="/" className="app-brand">
              ⚡ FAST POS
            </Link>

            {/* Menu Links */}
            <div className="app-menu">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "app-nav-link active" : "app-nav-link"
                }
              >
                <IconPOS /> Bán Hàng
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive ? "app-nav-link active" : "app-nav-link"
                }
              >
                <IconOrders /> Lịch Sử Đơn
              </NavLink>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<POS />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
