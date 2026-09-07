# The Tree Planner — Cross-Platform Architecture & Native Implementation

**The Tree Planner** is designed as a calm, anti-dopamine mobile planner for iOS and Android built around an offline-first, one-time paid business model.

---

## 1. Core Architectural Pillars

### Anti-Dopamine Tree Engine
- **No Instant Feedback Loops**: Completing a task does **not** trigger real-time leaf sprouting or slot-machine gamification.
- **Once-Daily Twilight Evaluation**: The tree evaluates the day’s metrics **strictly once per day at day’s end** (e.g. 21:00 or midnight background worker).
- **No Pet/Mascot Behavior**: The tree has no face, no mood, no dialogue, and no cuteness mechanics. It is an organic botanical mirror of the week.
- **Gentle Recovery**: Missed days result in a **Gentle Wilt / Seasonal Rest** (~14° soft droop in warm golden ochre and olive), which recovers fully to balanced/flourishing upon the next active day.

---

## 2. Platform Navigation & Motion Conventions

| Dimension | iOS (Human Interface Guidelines) | Android (Material 3) |
|---|---|---|
| **Motion Physics** | Interactive Spring `cubic-bezier(0.32, 0.72, 0, 1)` | M3 Standard Decel `cubic-bezier(0.2, 0, 0, 1)` |
| **Sheets & Modals** | Detented Bottom Sheets with top grab handle | M3 Rounded Edge-to-Edge Bottom Containers |
| **Navigation Bar** | Translucent frosted glass blur, SF Symbols | Floating Pill Container, Tonal Color Shifts |
| **Haptics** | UIImpactFeedbackGenerator (Light / Rigid) | HapticFeedbackConstants.CLOCK_TICK / VIRTUAL_KEY |
| **Typography** | New York / SF Pro with relaxed line heights | Roboto / Inter with relaxed letter spacing |

---

## 3. Flutter Reference Implementation Blueprint

### Project Structure (Clean Architecture)
```
lib/
├── core/
│   ├── theme/
│   │   ├── calm_colors.dart      # Sage, Parchment, Night Forest, Earth Ochre
│   │   └── calm_typography.dart  # Humanist serif & relaxed sans
│   └── crypto/
│       └── local_pin_vault.dart  # flutter_secure_storage / argon2
├── features/
│   ├── tree/
│   │   ├── presentation/
│   │   │   ├── tree_canvas.dart  # CustomPainter for procedural SVG states
│   │   │   └── tree_stats_sheet.dart
│   │   └── domain/
│   │       └── day_end_evaluator.dart
│   ├── tasks_habits/
│   │   ├── presentation/
│   │   │   ├── one_gesture_add_sheet.dart
│   │   │   └── calm_task_item.dart
│   │   └── data/
│   │       └── drift_local_db.dart # Local SQLite via Drift (zero cloud cost)
│   └── journal/
│       ├── presentation/
│       │   ├── locked_journal_page.dart
│       │   └── pin_keypad_dialog.dart
│       └── data/
│           └── encrypted_journal_repo.dart
└── main.dart
```

### Flutter CustomPainter Example (The Botanical Leaf Engine)
```dart
class BotanicalTreePainter extends CustomPainter {
  final TreeState state;
  final double breezeOffset; // Driven by AnimationController (7s duration)

  BotanicalTreePainter({required this.state, required this.breezeOffset});

  @override
  void paint(Canvas canvas, Size size) {
    final trunkPaint = Paint()
      ..color = const Color(0xFF5B4A3E)
      ..strokeWidth = 7.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final leafPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset.zero,
        Offset(size.width, size.height),
        [const Color(0xFFA5C3A8), const Color(0xFF5A735E)],
      );

    // Draw earth mound
    canvas.drawOval(
      Rect.fromCenter(center: Offset(size.width / 2, size.height - 20), width: 140, height: 24),
      Paint()..color = const Color(0xFF7A6555).withOpacity(0.8),
    );

    // Render state-specific geometry...
  }

  @override
  bool shouldRepaint(covariant BotanicalTreePainter oldDelegate) =>
      oldDelegate.state != state || oldDelegate.breezeOffset != breezeOffset;
}
```

---

## 4. React Native Blueprint

### Core Dependencies
- `@shopify/react-native-skia`: For ultra-smooth GPU-accelerated organic SVG tree rendering.
- `react-native-reanimated`: For 60fps spring transitions and downward drag-to-add gestures.
- `watermelondb` or `op-sqlite`: High-performance local-first SQLite storage.
- `react-native-keychain`: Hardware Secure Enclave PIN storage for journal lock.

### React Native Skia Tree Snippet
```tsx
import { Canvas, Path, LinearGradient, vec } from '@shopify/react-native-skia';
import { useDerivedValue, withRepeat, withTiming } from 'react-native-reanimated';

export const SkiaTreeCanvas = ({ state }: { state: TreeState }) => {
  // Slow 7s organic wind sway
  const sway = useDerivedValue(() => {
    return withRepeat(withTiming(1.2, { duration: 3500 }), -1, true);
  });

  return (
    <Canvas style={{ width: 300, height: 300 }}>
      {/* Botanical trunk and leaf clusters */}
      <Path
        path="M150 260 C148 200 152 160 148 120"
        strokeWidth={7}
        style="stroke"
        color="#5B4A3E"
      />
    </Canvas>
  );
};
```

---

## 5. Local-First Storage & Offline Privacy
- **Zero Cloud Costs**: All tasks, habits, and journals are stored in on-device SQLite / IndexedDB.
- **Manual Backup**: Users can export a clean JSON file and restore it at any time.
- **Cryptographic Journal Lock**: Passcode verified using SHA-256 / AES-GCM on-device, preserving user privacy without central database breach risks.
