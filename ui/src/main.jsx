import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const container = document.getElementById("app");
const queryClient = new QueryClient();

createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
