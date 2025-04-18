# Dish Detector

A Next.js 13+ app that detects ingredients via Ollama’s gemma3:4b model and returns matching recipes in strict JSON.

---

## Features

- **Ingredient detection** via gemma3:4b  
- **Strict JSON** output for easy integration  
- **TypeScript** throughout

---

## Prerequisites

- Node.js 14+ & npm/yarn  
- Ollama CLI with `gemma3:4b` pulled  
- A JSON/CSV file of your recipes (optional)

---

## Setup

1. **Clone & install**  
   ```bash
   git clone <repo-url>
   cd dish-detector
   npm install
   ```

2. **Environment**  
   Create `.env.local` and add:
   ```bash
   OLLAMA_HOST=127.0.0.1:11434
   ```

3. **Serve Ollama**  
   ```bash
   ollama pull gemma3:4b
   ollama serve gemma3:4b --port 11434
   ```

4. **Run dev server**  
   ```bash
   npm run dev
   ```

---

## Usage

1. Open `http://localhost:3000`  
2. Upload an image of ingredients  
3. Receive JSON with `ingredients` and suggested `recipes`

---

## Troubleshooting

- **404 on Ollama API**: ensure you ran `ollama serve` with correct `OLLAMA_HOST` and port.  
- **Parsing errors**: check that the model’s response is valid JSON.

---

## License

MIT © 2025
