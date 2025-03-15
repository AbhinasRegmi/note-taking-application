import { BrowserRouter, Route, Routes } from "react-router";
import { BaseLayout } from "./layouts/base";
import { HomePage } from "./pages/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "./pages/auth/login";
import { PublicLayout } from "./layouts/public";
import { SignupPage } from "./pages/auth/signup";
import { ForgotPassword } from "./pages/auth/forgot-password";

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
