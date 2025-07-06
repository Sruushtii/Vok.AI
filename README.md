<!-- Vok.AI Logo -->
<p align="center">
  <img src="frontend/public/vokai-favicon.svg" alt="Vok.AI Logo" width="100"/>
</p>

# Vok.AI

**Voice-powered communication & productivity platform**

---

## How Vok.AI Works

```mermaid
flowchart TD
    A["User"] -->|"Voice Command"| B["Frontend (Vok.AI Web App)"]
    B -->|"API Request"| C["Backend Server (API)"]
    C -->|"Process & AI Logic"| D["AI/Voice Recognition Module"]
    D -->|"Response"| C
    C -->|"API Response"| B
    B -->|"UI Update / Feedback"| A
    
    subgraph Frontend
        B
    end
    subgraph Backend
        C
        D
    end
```

- **User**: Interacts with the app using voice commands.
- **Frontend**: Captures voice, sends requests, and updates the UI.
- **Backend**: Handles API requests, processes data, and manages AI logic.
- **AI/Voice Module**: Performs voice recognition and intelligent automation.

---

<p align="center">
  <b>Simple. Fast. Voice-first.</b>
</p> 