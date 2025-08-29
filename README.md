# 🏦 VaultMate: Your Personal Banking Assitant 🤖

Clean, modular, and personal. VaultMate is a local-first playground of specialized AI agents for personal banking workflows. It ships with a FastAPI backend, a React demo frontend, domain knowledge in JSON, and persistent conversation memory in SQLite.

Built for tinkering, demos, and rapid iteration.

---

## What you get 🚀

- 🧭 Intelligent router that directs questions to the right banking domain agent
- 🧩 Six specialized agents: Accounts, Cards, Transactions, Loans & Investments, Payees, and General Banking
- 🌐 REST API with Swagger docs and a polished React chat UI
- 💾 Local persistence with SQLite memories and session storage
- ☁️ Pluggable Azure OpenAI backend via environment variables

---

## Architecture 🧩

Frontend (React) ↔ API (FastAPI) ↔ Team Router (agno) → Specialized Agents → Knowledge & Storage

- Team router: `agents/mainMasterAgent.py` uses `agno.Team` in route mode to choose the best agent
- Agents use Azure OpenAI models; responses are stateful via `agno` Memory + SQLite
- Knowledge lives under `knowledge/` (JSON) and embeddings are cached under `embeddings/`

See `api/api.py` for endpoints and startup; see `frontend/` for the UI.

---

## Repository layout 🗂️

- `agents/` — domain agents and the main router
  - `accounts/AccountMasterAgent.py`
  - `cards/CardsMasterAgent.py`
  - `transactions/TransactionMasterAgent.py`
  - `loansAndInsurance/LoansInvestmentsMasterAgent.py`
  - `payeesRecurringPayments/PayeesRecurringPaymentsMasterAgent.py`
  - `miscellaneous/MiscellaneousBankingMasterAgent.py`
  - `mainMasterAgent.py` — `Team` that routes between agents and initializes KBs
- `api/api.py` — FastAPI app, CORS, startup init, endpoints for each agent
- `frontend/` — React app (agent picker + chat UI)
- `knowledge/` — JSON datasets used to seed knowledge
- `embeddings/` — persisted embeddings (created/populated on first run)
- `tmp/` — SQLite memories and session storage
- `requirements.txt`, `pyproject.toml` — Python dependencies and metadata

---

## Quick start (Windows-friendly) ⚡🪟

1) Create and activate a venv

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

2) Add environment variables (create a `.env` in repo root)

```
DEPLOYMENT=<azure-deployment-name>
AZURE_OPENAI_API_KEY=<azure-api-key>
ENDPOINT=<azure-endpoint>
API_VERSION=<azure-api-version>
```

3) Install Python deps

```powershell
pip install -r requirements.txt
```

4) Run the API (auto-initializes all knowledge bases on startup)

```powershell
python api\api.py
# or
uvicorn api.api:app --reload --host 0.0.0.0 --port 8000
```

Open Swagger at `http://localhost:8000/docs`.

5) Run the frontend

```powershell
cd frontend
npm install
npm start
```

The UI expects the API at `http://localhost:8000`.

---

## Configuration ⚙️

- Azure OpenAI settings come from `.env` variables used by `AzureOpenAI` in agents
- CORS is open to `http://localhost:3000` by default (see `api/api.py`)
- To point the frontend elsewhere, set `REACT_APP_API_URL` before `npm start`

---

## API overview 🔌

- `GET /` and `GET /health` — health checks ✅
- `GET /agents` — list available agents 📋
- `POST /chat` — auto-routed chat via the main team agent 💬
- `POST /accounts/chat` — Accounts domain 💼
- `POST /cards/chat` — Cards domain 💳
- `POST /transactions/chat` — Transactions domain 💸
- `POST /loans/chat` — Loans & Investments domain 📈
- `POST /payees/chat` — Payees & Recurring Payments domain 🔁
- `POST /miscellaneous/chat` — General banking services 🧰

Request body (all chat routes):

```json
{
  "message": "Show me my card statement",
  "user_id": "user123",
  "session_id": "optional"
}
```

---

## Knowledge, embeddings, memory 🧠💽

- Knowledge: seed JSON in `knowledge/`
- Embeddings: created/cached under `embeddings/` per domain on first initialization
- Memory & sessions: stored in SQLite under `tmp/` (e.g., `tmp/main_banking_agent.db`)

To regenerate embeddings for a domain, delete its folder under `embeddings/` and restart the API.

---

## Development tips 🛠️

- Add a new agent: create a sub-folder in `agents/`, expose an initializer, and wire it into `members` in `agents/mainMasterAgent.py`
- Use `initialize_all_knowledge_bases()` during local scripts to prewarm embeddings
- Keep long-running state out of code; rely on `.env`, `embeddings/`, and `tmp/`

---

## Troubleshooting 🐞

- Startup fails: check `.env` values and Azure keys
- Slow first run: embeddings build can take time; they are cached afterward
- Frontend CORS: adjust `allow_origins` in `api/api.py` to match your host
- Empty responses: validate `DEPLOYMENT`, `ENDPOINT`, and `API_VERSION` are correct

---

## Security notes 🔒

- Do not commit real secrets or personal data
- Treat `tmp/` and `embeddings/` as potentially sensitive in real scenarios
- Add auth/rate limits before exposing publicly

---

## License 📄

MIT