"use client";
import ThemeToggle from "./components/ThemeToggle";
import ResultArea from "./components/ResultArea";
import { useState } from "react";
import ValuesForm from "./components/ValuesForm";

const Page = () => {
  const [result, setResult] = useState(null);

  return (
    <main className="min-h-screen">
      <ThemeToggle />
      <ValuesForm setResult={setResult} />
      <ResultArea result={result} />
    </main>
  );
};
export default Page;
