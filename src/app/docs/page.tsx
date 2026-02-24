"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p className="p-8">Loading API docs...</p>,
});

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen">
      <SwaggerUI url="/api/v1/openapi.json" />
    </main>
  );
}
