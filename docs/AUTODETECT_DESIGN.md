# SHIBA Auto-detection Design Document

## Overview

Auto-detection is the core feature inspired by OpenTIL's intelligent insight capture system. It proactively suggests capturing knowledge when it detects task boundaries -- moments where the user has made a discovery, solved a problem, or encountered an "aha" moment.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Auto-detection State Machine                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    every turn    ┌───────────────────────┐        │
│  │  Start   │ ───────────────>│ Increment Turn Counter │        │
│  └──────────┘                  └───────────┬───────────┘        │
│                                            │                     │
│                                            ▼                     │
│                               ┌────────────────────────┐         │
│                               │ sessionRejected == true?│        │
│                               └───────────┬────────────┘         │
│                                   Yes │      │ No               │
│                                       │      │                  │
│                                       │      ▼                  │
│                                       │  ┌──────────────────┐    │
│                                       │  │ Turn - lastAccept │    │
│                                       │  │    < cooldown?    │    │
│                                       │  └────────┬─────────┘    │
│                                       │     Yes │    │ No       │
│                                       │         │    │          │
│                                       │         │    ▼          │
│                                       │         │  ┌──────────┐  │
│                                       │         │  │ isTask   │  │
│                                       │         │  │Boundary? │  │
│                                       │         │  └────┬─────┘  │
│                                       │         │  Yes │    No  │
│                                       │         │       │        │
│                                       │         │       │        │
│                                       │         ▼       │        │
│                                       │   ┌──────────────┐│       │
│                                       │   │ Generate     ││       │
│                                       │   │ Suggestion   ││       │
│                                       │   └──────┬───────┘│       │
│                                       │          │        │       │
│                                       │          ▼        │       │
│                                       │   ┌──────────────┐│       │
│                                       │   │ Show to User ││       │
│                                       │   └──────────────┘│       │
│                                       │          │        │       │
│                                       └──────────┼────────┘       │
│                                                  │                 │
│                              ┌───────────────────┴───────────┐    │
│                              │       User Response            │    │
│                              └───┬─────────┬─────────┬───────┘    │
│                                  │         │         │            │
│                                  ▼         ▼         │            │
│                             ┌────────┐ ┌────────┐   │            │
│                             │  yes   │ │  no    │   │            │
│                             └───┬────┘ └───┬────┘   │            │
│                                 │         │         │            │
│                                 ▼         ▼         │            │
│                           ┌─────────┐ ┌──────────┐  │            │
│                           │ Accept  │ │ Reject   │  │            │
│                           │         │ │ (global) │  │            │
│                           │ Create  │ │          │  │            │
│                           │ SHIBA   │ │ session  │  │            │
│                           │         │ │Rejected= │  │            │
│                           │ lastAcc=│ │  true    │  │            │
│                           │ current │ │          │  │            │
│                           └─────────┘ └──────────┘  │            │
│                                                       │            │
└───────────────────────────────────────────────────────┼────────────┘
```

## State Object

```typescript
interface AutoDetectState {
  enabled: boolean;           // Global on/off switch
  sessionRejected: boolean;   // Rejected once this session -> never ask again
  lastAcceptedTurn: number;   // Turn number when user last accepted
  currentTurn: number;        // Current conversation turn
  cooldownTurns: number;      // Turns to wait after acceptance (default: 15)
  lastSuggestionAt: string | null; // ISO timestamp
  totalSuggestions: number;  // Lifetime stats
  totalAccepted: number;      // Lifetime stats
}
```

## Detection Patterns

### Positive Patterns (Task Boundaries)

| Category | Patterns | Example |
|----------|----------|---------|
| Bug fix | `fix`, `solved`, `resolved`, `fixed` | "Fixed the N+1 query issue" |
| Working | `got it working`, `finally works` | "Got it working with a mutex" |
| Discovery | `interesting`, `surprising`, `unexpected` | "Interesting, it caches by default" |
| Aha | `aha`, `eureka`, `oh I see`, `that's why` | "Oh, that's why it was failing" |
| Tip | `note to self`, `remember this`, `useful tip` | "Note to self: always check the logs first" |
| Root cause | `root cause`, `it was because`, `turned out to be` | "The root cause was a race condition" |

### Negative Patterns (Active Work)

| Category | Patterns | Example |
|----------|----------|---------|
| Questions | `how`, `what`, `why`, `can you` | "How do I fix this?" |
| Unresolved | `still not working`, `doesn't work` | "It still doesn't work" |
| Uncertain | `maybe`, `I think`, `not sure` | "Maybe try this approach?" |
| Testing | `let me try`, `testing` | "Let me try a different approach" |

## Decision Flow

```typescript
function shouldSuggest(userId: string, message: string): SuggestionResult {
  const state = getAutoDetectState(userId);
  
  // 1. Check if disabled
  if (!state.enabled) return { shouldSuggest: false };
  
  // 2. Check if user rejected this session
  if (state.sessionRejected) return { shouldSuggest: false };
  
  // 3. Check cooldown period
  const turnsSinceAccept = state.currentTurn - state.lastAcceptedTurn;
  if (turnsSinceAccept < state.cooldownTurns) {
    return { shouldSuggest: false, reason: 'cooldown' };
  }
  
  // 4. Detect task boundary
  if (!isTaskBoundary(message)) return { shouldSuggest: false };
  
  // 5. Extract insight
  const insight = extractInsight(message);
  if (!insight) return { shouldSuggest: false };
  
  return { shouldSuggest: true, ...insight };
}
```

## Response Format

When suggesting, append to the END of normal response:

```
[Your normal response content here...]

💡 TIL: [Concise insight title, max 50 chars]
Tags: [tag1, tag2, tag3] · 记录一下？(yes/no)
```

### Language Adaptation

| User Language | Suggestion Format |
|---------------|-------------------|
| Chinese (zh-CN) | `💡 TIL: ... Tags: ... · 记录一下？(yes/no)` |
| English (en) | `💡 TIL: ... Tags: ... · Save it? (yes/no)` |

## Integration Points

### 1. Message Handler (Agent Side)

```typescript
// In message processing loop
async function handleMessage(userId: string, message: string) {
  // ... process message ...
  
  // Check auto-detection
  incrementTurn(userId);
  const suggestion = shouldSuggest(userId, message);
  
  if (suggestion.shouldSuggest) {
    const response = generateSuggestionText(suggestion, detectLang(message));
    // Append to response
  }
}
```

### 2. Response Handler (CLI Side)

```typescript
// When user responds to suggestion
async function handleSuggestionResponse(userId: string, response: string) {
  const decision = parseSuggestionResponse(response);
  
  if (decision === 'accept') {
    acceptSuggestion(userId);
    // Create SHIBA from captured insight
  } else if (decision === 'reject') {
    rejectSuggestion(userId);
  }
  // else: ignore, wait for next message
}
```

### 3. API Endpoint (Optional)

```typescript
// POST /api/shiba/autodetect
// Body: { userId, action: 'increment' | 'accept' | 'reject', message? }
// Returns: { shouldSuggest, suggestion? }
```

## Configuration

| Parameter | Default | Description |
|-----------|--------|-------------|
| `cooldownTurns` | 15 | Turns to wait after acceptance |
| `enabled` | true | Global on/off switch |
| `minConfidence` | 0.7 | Minimum confidence to suggest |

## Privacy & UX Principles

1. **Non-intrusive**: Only suggests at genuine task boundaries, never during active work
2. **Respectful**: Once rejected, never asks again this session
3. **Cooldown**: After acceptance, waits 15 turns to avoid fatigue
4. **Concise**: One line + tags, no lengthy explanation
5. **Language match**: Automatically adapts to user's language
6. **Persistent state**: State survives API restarts but resets per session

## Future Enhancements

1. **Learning**: Track which suggestions are accepted to improve pattern matching
2. **Context awareness**: Consider conversation topic continuity
3. **Smart cooldown**: Adjust cooldown based on user behavior
4. **Multi-turn insights**: Combine multiple messages into one insight
5. **Integration with /shiba**: Seamlessly create SHIBA from suggestion
