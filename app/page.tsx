"use client";
import { useState, ChangeEvent } from "react";

interface Recipe {
  title: string;
}

interface AnalyseResult {
  ingredients: string[];
  recipes: Recipe[];
  error?: string;
}

export default function Home() {
  const [file, setFile] = useState<File>();
  const [results, setResults] = useState<AnalyseResult>();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const analyse = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(",")[1];
      const res = await fetch("/api/recognise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64 }),
      });
      setResults((await res.json()) as AnalyseResult);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">Dish Detector</h1>
      <input type="file" onChange={handleFile} />
      <button disabled={!file} onClick={analyse} className="ml-3 btn">
        Analyse
      </button>

      {results?.error && (
        <p className="mt-4 text-red-600">Error: {results.error}</p>
      )}

      {results && !results.error && (
        <section className="mt-6">
          <h2 className="text-xl">Ingredients</h2>
          <ul className="list-disc pl-5">
            {results.ingredients?.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <h2 className="text-xl mt-4">Dishes</h2>
          {JSON.stringify(results.recipes)}
          <ul className="list-disc pl-5">
            {results.recipes?.map((d) => (
              <li key={d.title}>
                <a href={d.title} className="underline">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
