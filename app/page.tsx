'use client';
import { useState, ChangeEvent } from "react";
import { Globe, Leaf } from "lucide-react";

interface Recipe {
  title: string;
  cuisine: string;
  dietary: string[];
  ingredients: string[];
  steps: string[];
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
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Dish Detector</h1>

      <div className="flex items-center mb-6">
        <input type="file" onChange={handleFile} className="mr-3" />
        <button
          disabled={!file}
          onClick={analyse}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Analyse
        </button>
      </div>

      {results?.error && (
        <p className="mt-4 text-red-600">Error: {results.error}</p>
      )}

      {results && !results.error && (
        <section className="space-y-6">

          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {results.ingredients.map(ing => (
                <div
                  key={ing}
                  className="bg-gray-100 rounded-lg p-3 text-center shadow-sm"
                >
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* Recipes */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Suggested Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.recipes.map(r => (
                <div
                  key={r.title}
                  className="border rounded-lg p-5 shadow hover:shadow-lg transition"
                >
                  <h3 className="font-medium text-lg mb-2">{r.title}</h3>

                  {/* Cuisine */}
                  <div className="flex items-center text-sm text-gray-700 mb-3">
                    <Globe className="w-5 h-5 mr-1" />
                    <span>{r.cuisine}</span>
                  </div>

                  {/* Dietary */}
                  <div className="flex items-center space-x-4 mb-4">
                    {r.dietary.map((d) => {
                      const key = d.toLowerCase();
                      let Icon = Leaf;
                      if (key.includes('lacto') || key.includes('dairy')) Icon = Leaf;
                      return (
                        <div
                          key={d}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          <span>{d}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ingredients */}
                  <div className="mb-3">
                    <strong>Ingredients:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      {r.ingredients.map(ing => (
                        <li key={ing}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div>
                    <strong>Steps:</strong>
                    <ol className="list-decimal pl-5 mt-1">
                      {r.steps.map((step, idx) => (
                        <li key={idx} className="mb-1">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}
    </main>
  );
}
