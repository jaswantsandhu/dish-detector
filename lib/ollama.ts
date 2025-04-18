export interface Recipe {
  title: string
  cuisine: string
  dietary: string[]        // e.g. ["vegetarian", "lacto"]
  ingredients: string[]
  steps: string[]
}

export interface AnalyseResponse {
  ingredients: string[]
  recipes: Recipe[]
}

interface OllamaRawResponse {
  response: string
}

export async function analyseImageWith(
  base64Image: string,
  model = 'gemma3:4b'
): Promise<AnalyseResponse> {
  const payload = {
    model,
    images: [base64Image],
    prompt: `
      Identify all ingredients visible in this image, then suggest recipes that use exactly those ingredients.
      For each recipe include:
        - title
        - cuisine (e.g. Italian, Indian, Mexican)
        - dietary categories (e.g. vegetarian, vegan, lacto)
        - ingredients list
        - step-by-step instructions
      Return ONLY a JSON object matching this shape, with no extra text:

      {
        "ingredients": [string, …],
        "recipes": [
          {
            "title": string,
            "cuisine": string,
            "dietary": [string, …],
            "ingredients": [string, …],
            "steps": [string, …]
          }
        ]
      }
    `,
    format: 'json',
    stream: false
  }

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Ollama error ${res.status}: ${body}`)
  }

  const raw = (await res.json()) as OllamaRawResponse

  let parsed: AnalyseResponse
  try {
    parsed = JSON.parse(raw.response)
  } catch {
    throw new Error('Failed to parse JSON from DeepSeek response')
  }

  return parsed
}
