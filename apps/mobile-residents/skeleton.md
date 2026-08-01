Quick start
1. Install

bash

copy
npm install boneyard-js
2. Wrap your components

tsx

copy
import { Skeleton } from 'boneyard-js/native'

function ProfileScreen() {
  const [loading, setLoading] = useState(true)
  return (
    <Skeleton name="profile-card" loading={loading}>
      <ProfileCard />
    </Skeleton>
  )
}
3. Generate bones

bash

copy
npx boneyard-js build --native --out ./bones
Then open your app on device or simulator. Bones are captured automatically.

4. Import the registry and reload

tsx

copy
// Add once in your app entry (e.g. App.tsx)
import './bones/registry'
This import is required.Without it, skeletons won't render. Reload your app after adding it — the skeletons will render on the next launch.

How native scanning works
On web, the CLI opens a headless browser and snapshots the DOM. On React Native, the <Skeleton> component itself does the scanning — no browser needed.

# Terminal — start the capture listener
npx boneyard-js build --native --out ./bones
# Open your app on device or simulator
# Bones appear in the CLI as they're captured
# Press Ctrl+C when done
What happens under the hood

The CLI starts a listener on port 9999 and waits for bone data.
In dev mode, every <Skeleton name="..."> checks if the CLI is listening.
If found, it walks the React fiber tree, measures each native view's position with UIManager.measureLayout, and sends the results.
The CLI writes .bones.json files + a registry.js that imports from boneyard-js/native.
Scanning happens once per named skeleton, 800ms after mount. In production builds (__DEV__ === false) the scan code is completely inactive — zero overhead.

Reload after generating bones

After running build --native, you need to reload your app for the new bone data to take effect. The registry is imported at startup — a hot reload won't pick up new .bones.jsonfiles. Shake your device and tap "Reload", or press r in the Expo terminal.

Dynamic Type & accessibility text sizing
Boneyard adapts to iOS Dynamic Type and Android font scaling at runtime. When a user changes their text size, the actual content grows or shrinks — boneyard detects the new container height and scales bone positions proportionally to match.

Generate bones at default font scale

Always capture bones with your device set to the defaulttext size (font scale 1.0). The skeleton automatically scales bone positions up or down at runtime to match the user's actual font scale — no need to capture at multiple sizes.

Under the hood, children are rendered invisibly behind the skeleton overlay so the container reflects the real content height. A scaleY ratio adjusts all bone Y positions and heights to fit.

Other ways to generate bones
The --native flag is the easiest way. But if you need alternatives:

Expo web

If your app supports Expo web, you can use the standard web CLI. Create a capture page with the web Skeleton, run npx expo start --web, then npx boneyard-js build http://localhost:8081 --native. The --native flag ensures the registry imports from boneyard-js/native.

Copy from a web project

If you already have a web version with boneyard, just copy the .bones.json files. The format is identical across platforms.

bash

copy
cp src/bones/*.bones.json ../my-rn-app/bones/
Write by hand

Bones are compact tuples: [x, y, w, h, r, c?].x/w are % of container width,y/h are pixels,r is border radius,c marks container bones.

bones/card.bones.json

copy
{
  "breakpoints": {
    "375": {
      "name": "card",
      "viewportWidth": 375,
      "width": 343,
      "height": 200,
      "bones": [
        [0, 0, 100, 200, 12, true],
        [4, 16, 18, 64, "50%"],
        [26, 20, 45, 18, 6]
      ]
    }
  }
}
Props
Prop	Type	Default	Description
loading	boolean	—	Show skeleton or children
name	string	—	Resolve bones from registry by name (also used for scanning)
initialBones	ResponsiveBones	—	Pass bones directly (takes precedence over registry)
color	string	#d4d4d4	Bone color in light mode
darkColor	string	#3a3a3c	Bone color in dark mode
dark	boolean	auto	Force dark/light mode (defaults to system scheme)
animate	boolean	true	Enable pulse animation
style	ViewStyle	—	Additional style for the container
stagger	number | boolean	false	Stagger delay between bones in ms (true = 80ms)
transition	number | boolean	false	Fade out duration in ms when loading ends (true = 300ms)
fallback	ReactNode	—	Shown when loading but no bones are available
Dark mode
Auto-detects via useColorScheme(). Override with the dark prop if your app manages its own theme:

tsx

copy
// Force light mode regardless of system theme
<Skeleton loading={loading} dark={false}>

// Force dark mode
<Skeleton loading={loading} dark={true}>

// Custom dark mode colors
<Skeleton loading={loading} dark darkColor="#1e1e2e">
Expo & Metro setup
Requirement	Minimum version
Expo SDK	50+ (Fabric/New Architecture enabled by default)
React Native (bare)	0.71+ (works with both Paper and Fabric)
Import from boneyard-js/native (not boneyard-js/react-native). Metro has special handling for paths containing "react-native" which can cause resolution issues.

If you link the package locally during development, add the source directory to Metro's watch folders:

metro.config.js

copy
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Only needed for local symlinked development
const boneyardPath = path.resolve(__dirname, '../boneyard/packages/boneyard')
config.watchFolders = [boneyardPath]
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(boneyardPath, 'node_modules'),
]

module.exports = config
When using boneyard-js from npm (not a local symlink), no Metro config changes are needed.

Project structure
my-rn-app/
├── bones/
├── profile-card.bones.json
├── feed-item.bones.json
└── registry.js ← auto-generated
├── components/
├── ProfileCard.tsx
└── FeedItem.tsx
├── App.tsx ← import './bones/registry'
├── app.json
└── package.json
Differences from web
Feature	Web	React Native
Import	boneyard-js/react	boneyard-js/native
CLI	npx boneyard-js build	npx boneyard-js build --native
How it scans	Headless browser (Playwright)	Fiber tree + UIManager on device
Animation	CSS keyframes	Animated API (opacity pulse)
Dark mode	prefers-color-scheme + .dark class	useColorScheme() + dark prop
Responsive	ResizeObserver on container	useWindowDimensions (screen width)
Text scaling	N/A (browser handles it)	scaleY adapts to Dynamic Type / font scale
Bone format	Identical .bones.json — fully cross-platform
Auth-protected screens
With --native, auth is a non-issue. Your app is already running on the device with the user logged in — the Skeleton component scans whatever is currently rendered. There are no cookies or headers to configure because no browser is involved.

The auth config in boneyard.config.json (cookies, headers) is only for the web CLI path where a headless browser needs to access protected pages. With --native, the device handles auth natively — just open the screen you want to scan.

Next steps

See Getting Started for the full web setup walkthrough
See Output to understand the .bones.json format in detail
Browse Examples for bone data you can use in your RN app