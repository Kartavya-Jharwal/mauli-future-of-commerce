# agentic_ai_integration_prd.md

- Source ID: `LOCAL-02`
- Evidence ID: `LOCAL-02`
- Original: [supplied file](../../agentic_ai_integration_prd.md)
- SHA-256: `e55a80c589fbccac523cf242bfd10523463d79b633955aeabe8add7d16db0e2a`
- Provenance: supplied input; assertions are not independently verified.
- Conversion date: 2026-10-10
- Coverage: 1 document(s).
- Limitations: Markdown retained; embedded image payloads omitted. Images remain in original.

---

# Product Requirements Document (PRD)

**Product:** The Celestial Resonator (Hybrid Agentic & System 1 Decision Model Architecture)  
**Target Audience:** UHNW & Luxury Ayurvedic Wellness Consumers  
**Version:** 3.0 (Master Integration: System 1 Decision Engine, ElevenLabs Voice, Synesthetic Physics & Spatial UI)

---

## 1. Product Vision & Architecture Evolution

To deliver an ultra-fast, ultra-luxurious experience, we eliminate slow, probabilistic, multi-agent LLM text generation on the backend engine. Instead, we divide the platform into a decoupled dual-engine model:

1. **System 1 Decision Models (Non-Autoregressive Neural Nets):** Utilizing cutting-edge architectures (such as TypeSafe AI's Jev framework), these models execute microsecond backend classification, inventory negotiation, energetic vector mapping, and UI parameter routing in a single forward pass. They yield bounded, deterministic choices with calibrated confidence scores ($0.0 - 1.0$) rather than probabilistic text, executing in $< 30\text{ms}$.
2. **System 2 Generative Agents (LLMs & Voice Synthesis):** Used exclusively for the user-facing "Oracle" persona and ElevenLabs audio streaming where nuanced, luxurious text generation and conversational empathy are required.

This decoupled architecture allows the backend to perform real-time inventory adjustments, chord physics calculations, and profit optimization in sub-50ms cycles without consuming expensive tokens, risking prompt drift, or causing UI latency.

---

## 2. Dual-Engine Architecture Blueprint

```
                      [User Voice / Text Input]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ ElevenLabs Conversational│
                     │  Voice AI & System 2  │ (Generative Voice / LLM)
                     │   "The Oracle"        │
                     └───────────┬───────────┘
                                 │ Extracts Natural Language Intent
                                 ▼
               ┌──────────────────────────────────┐
               │  System 1: Diagnostic Classifier │ (Bounded Decision Model)
               │  - Sub-50ms Vector Evaluation    │
               │  - ReAct / Decision Matrix       │
               └────────────────┬─────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌────────────────────────────────┐           ┌────────────────────────────────┐
│ System 1: The Vaidya Engine    │           │ System 1: The Merchant Engine  │
│ Maps: Input -> Energetic Vector│           │ Maps: Vector + Margin -> SKU   │
│ Confidence: Calibrated (0-1.0) │           │ Confidence: Calibrated (0-1.0) │
└────────┬───────────────────────┘           └────────┬───────────────────────┘
         │                                            │
         └───────────────────────┬────────────────────┘
                                 │ Resolved Choice Vector
                                 ▼
                     ┌──────────────────────────┐
                     │ System 1: Synesthete UI  │
                     │ Bounded Parameters for   │
                     │ Chord Physics & Colors   │
                     └──────────────────────────┘
```

---

## 3. Specialized System 1 Models & System 2 Audio/Text Engines

### 1. System 2: The Oracle & ElevenLabs Voice Engine (User Interaction Layer)
* **Model Type:** Fine-tuned Autoregressive LLM + ElevenLabs Conversational AI WebSockets.
* **Role:** The charismatic, esoteric conversationalist and voice twin.
* **Function:** Interprets natural language and low-latency voice streams ("I haven't slept, my skin feels inflamed, and I feel ungrounded") into intuitive physical/emotional themes. It converts voice input to text and back to high-end, custom-voiced acoustic feedback without ever touching backend inventory math.

### 2. System 1: The Vaidya (Diagnostic Vector Engine)
* **Model Type:** Bounded Decision Model (Non-Autoregressive, Single Forward Pass via Jev-style Architecture).
* **Role:** Instantaneous Ayurvedic Energetic Classification.
* **Function:** Evaluates user intent against fixed energetic vector categories ($Vata$, $Pitta$, $Kapha$, $Ojas$, $Prana$, $Tejas$). Rather than generating text, it outputs a calibrated probability distribution across energy vectors in under 20ms:

$$P(\text{State}) = [V: 0.82, P: 0.64, K: 0.12, O: 0.35]$$

### 3. System 1: The Merchant (Commercial Optimization Decision Engine)
* **Model Type:** Bounded Utility Classifier (Non-Autoregressive).
* **Role:** Margin-driven inventory negotiator & commercial router.
* **Function:** Takes energetic output vectors from The Vaidya and evaluates them against discrete business choices (SKUs, variants, margin tiers, stock levels).
* **Decision Formula:**

$$U_i = f(\text{EnergeticRelevance}_i) \cdot w_1 + \text{Margin}_i \cdot w_2 + \text{StockTier}_i \cdot w_3$$

* **Output:** A deterministic decision choice (e.g., `CHOICE: SKU_HERO_BALM_01`, `CONFIDENCE: 0.94`) executed without text parsing overhead or hallucination risk.

### 4. System 1: The Synesthete (UI Physics & Chord Choreographer)
* **Model Type:** Discrete UI Attribute Classifier.
* **Role:** Direct controller of WebGL / Three.js / Canvas parameter matrices.
* **Function:** Converts the Merchant's selected SKU and the Vaidya's energetic vector directly into mathematical bounds for the frontend chord diagram:
  * Active Node IDs & Connection Weights
  * Line Tension, Curve Curvature, and Velocity Vectors
  * RGB Color Gradients (e.g., Deep Crimson for Pitta, Violet/Amber for Ojas)
  * Harmonic Audio Frequencies (e.g., 432Hz vs 528Hz continuous sine wave modulations)

---

## 4. Deep Chord Graph Theory & Physics Specification

The "Eternal Jukebox" UI is an interactive, radial dependency web representing the synesthetic connection between internal energy and physical botanicals.

```
       [Vata] (Node 1) ─────────── Line Tension (T) ─────────── [Ashwagandha] (Note A)
          │                                                          │
   Curvature (κ)                                              Opacity (α)
          │                                                          │
          ▼                                                          ▼
       [Pitta] (Node 2) ───────────────────────────────────────── [Saffron] (Note B)
```

### Physics & Visual Mechanics
1. **Nodes (Internal Energies & Botanicals):**
   * Placed along a circular perimeter using polar coordinates $(\rho, \theta)$.
   * **Energetic Nodes (Left Hemisphere):** Primary Doshas and Subtle Meridians (*Prana*, *Sadhaka Pitta*, *Vyan Vata*).
   * **Botanical/Mineral Notes (Right Hemisphere):** High-vibrational ingredients (*Saffron*, *Shilajit*, *Sandalwood*, *Gold Bhasma*).
2. **Bezier Curves (The Chords):**
   * Connections are calculated as quadratic or cubic Bezier curves drawing from control points pulled inward toward a gravitational center node $(0,0)$.
   * **Line Tension ($T$):** Higher confidence scores from System 1 tighten the curve towards the center.
   * **Oscillation & Frequency:** Lines vibrate continuously using a simple harmonic oscillator function ($x(t) = A \cos(\omega t + \phi)$) mapped to active voice pitch or audio frequencies.
3. **Color Gradients:**
   * Interpolated dynamically in shader space between node source colors ($C_{\text{source}}$) and target note colors ($C_{\text{target}}$) using the Vaidya engine's vector weights.

---

## 5. Commercial Benefit & Faux-Pas Execution Mechanics

By running the "Faux Pas" strategy via System 1 Decision Models, the brand can dynamically adjust merchandising weights in real time during flash sales, seasonal shifts, or inventory excesses without disturbing user trust:

```
[User Input: "Stressed & Inflamed"]
        │
        ▼
System 1 Vaidya Vector ──► [Vata: 0.85, Pitta: 0.70]
        │
        ├──────────────────────────────────────────────────────┐
        ▼                                                      ▼
[Scenario A: Normal Stock]                             [Scenario B: Excess Stock SKU_02]
Weight Bias: Balanced                                  Weight Bias: $w_2$ (Margin) boosted +40%
        │                                                      │
        ▼                                                      ▼
Route: Highlighting Note "Ashwagandha" in SKU_01       Route: Highlighting Note "Saffron" in SKU_02
Narrative: "Calm the Vata wind with Ashwagandha."      Narrative: "Cool the Pitta fire with Saffron."
```

* **Instantaneous Re-weighting:** Merchandisers alter weight parameters ($w_1, w_2, w_3$) in the System 1 decision engine.
* **Zero Prompt Drift:** Evaluated within strict mathematical choice bounds, making it impossible for the system to route to an out-of-stock item or output invalid visual chord node combinations.
* **Seamless Theatre:** The user experiences sub-50ms response times from input to chord diagram visualization. The "mystic reading" feels instantaneous, responsive, and organic while executing optimal commercial strategy behind the scenes.

---

## 6. Spatial UI & Multi-Breakpoint Placement Strategy

To ensure high conversion across desktop, web, and native mobile environments, the Celestial Resonator adapts dynamically to three primary spatial modalities:

```
+-----------------------------------------------------------------------------------+
| Desktop / Immersive Stage Mode                                                    |
| +----------------------------------+ +------------------------------------------+ |
| | System 2 Oracle & ElevenLabs     | | System 1 Synesthete Chord Diagram       | |
| | Voice Twin Interface             | | Interactive Radial Web (Three.js/WebGL)  | |
| | - Ambient Waveforms              | | - Dynamic Bezier Physics                 | |
| | - Natural Language Guidance      | | - Active Botanical Node Highlights     | |
| +----------------------------------+ +------------------------------------------+ |
+-----------------------------------------------------------------------------------+

+-------------------------------------+  +------------------------------------------+
| Mobile & Native App Mode            |  | E-Commerce Floating Widget Mode          |
| +---------------------------------+ |  | +--------------------------------------+ |
| | Synesthete Chord Web (Header)   | |  | | Mini Pulsing Aura Avatar             | |
| | [ Interactive Canvas ]          | |  | +--------------------------------------+ |
| +---------------------------------+ |  | | Voice Tap -> Expands to Micro-Chord   | |
| | Oracle Text/Voice Drawer        | |  | | Diagram overlaid on Product Page     | |
| | [ Expandable Bottom Sheet ]     | |  | +--------------------------------------+ |
| +---------------------------------+ |  +------------------------------------------+
+-------------------------------------+
```

### 1. Standalone Immersive Stage (Desktop / Vision Pro)
* **Layout:** Fullscreen split-stage (50/50 view). Left side holds the ElevenLabs voice waveform avatar and Oracle dialogue; right side renders a 3D WebGL Web of Chords.
* **Interaction:** Mouse hover triggers pitch-shifted resonant audio tones; click selects energetic paths.

### 2. Floating E-Commerce Widget (Mobile & Web Overlay)
* **Layout:** Persistent, elevated floating orb at the bottom-right corner of standard collection/product detail pages.
* **Behavior:** Tapping the widget opens an ethereal modal drawer with an embedded micro-canvas rendering a simplified 3-node chord diagram.
* **Direct PDP Injections:** The widget highlights active notes on the specific Product Detail Page (PDP) the user is currently viewing, explicitly connecting their energetic reading to the product in front of them.

### 3. Native App / Mobile Breakpoint Mode
* **Layout:** Vertical stacking architecture with sticky spatial canvas at the top 45% of screen height and a swipeable bottom sheet for voice interaction and narrative readings.
* **Haptics:** Integrates native device haptics (iOS CoreHaptics / Android HapticFeedback) vibrating in sync with chord line tension changes during voice input.

---

## 7. Operational & Latency Metrics Matrix

| Metric / Dimension | Traditional Pure LLM Architecture | System 1 Decision Model + System 2 Hybrid |
| :--- | :--- | :--- |
| **Diagnostic Vector Scoring** | 1200ms – 2500ms (LLM Text Parsing) | **< 20ms** (Single Forward Pass) |
| **Inventory & Commercial Routing** | 800ms (Prompt-Engineered Function Calls) | **< 15ms** (Bounded Choice Matrix) |
| **Voice Input to Visual Feedback** | ~3000ms Total Latency | **< 300ms** (ElevenLabs Stream + Tensor Mapping) |
| **Frontend Parameter Routing** | Structured JSON Parsing from LLM | **Direct Tensor-to-WebGL Canvas Mapping** |
| **Cost per Interaction** | High (Multi-agent Token Usage) | **Minimal** (Inference-Efficient Decision Models) |
| **Output Reliability** | Hallucination risks on SKU availability | **100% Deterministic & Calibrated Choice** |
