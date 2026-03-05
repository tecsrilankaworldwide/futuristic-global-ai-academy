{
  "brand": {
    "name": "Unplugged AI Academy (working name)",
    "personality": [
      "child-first",
      "encouraging",
      "curious + playful (not chaotic)",
      "teacher-trustworthy",
      "tablet-native",
      "game-like progression",
      "accessible + readable"
    ],
    "design_north_star": "Make unplugged AI/CS feel like a friendly adventure: big touch targets, clear next steps, gentle celebration, and calm backgrounds with colorful accents."
  },

  "inspiration_refs": {
    "search_notes": [
      "Use bento-card dashboards + gamification patterns common in 2025–2026 edtech UIs (Dribbble/Behance explorations).",
      "Lean on modular card grids, sticker-like badges, progress rings/bars, and friendly illustration slots.",
      "Avoid purple-heavy AI aesthetics; prefer ocean/teal + sunshine + coral accents."
    ],
    "urls": {
      "dribbble_gamification_dashboard_search": "https://dribbble.com/search/gamification-dashboard",
      "behance_education_dashboard_search": "https://www.behance.net/search/projects/education%20dashboard?locale=en_US",
      "figma_gamification_dashboard_file": "https://www.figma.com/community/file/1592409320704734715/gamification-dashboard"
    }
  },

  "design_style_fusion": {
    "primary_style": "Bento Grid Layout + Card Layout",
    "secondary_style": "Soft Neo-brutal (bold outlines, sticker badges) tempered with Calm Swiss spacing",
    "material_notes": [
      "Mostly solid surfaces with subtle noise texture; very restrained gradients only as section backdrops (<=20% viewport).",
      "Rounded geometry + ‘toy-like’ depth: small shadows, occasional inset highlight.",
      "Use icons + short labels for young kids; add helper microcopy for parents/teachers."
    ]
  },

  "typography": {
    "google_fonts": {
      "heading": {
        "family": "Space Grotesk",
        "weights": [500, 600, 700],
        "usage": "H1/H2, card titles, key numbers"
      },
      "body": {
        "family": "Nunito",
        "weights": [400, 600, 700],
        "usage": "Body text, UI labels, helper text"
      },
      "mono_optional": {
        "family": "Source Code Pro",
        "weights": [500, 600],
        "usage": "Optional for ‘algorithm steps’ / ‘logic blocks’ callouts"
      }
    },
    "tailwind_text_hierarchy": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base md:text-lg font-semibold text-muted-foreground",
      "h3": "text-xl md:text-2xl font-semibold",
      "body": "text-sm md:text-base leading-relaxed",
      "small": "text-xs md:text-sm text-muted-foreground"
    },
    "reading_rules": [
      "Default body size on tablets: 16–18px; never below 14px for primary content.",
      "Kids (5–8) mode: bump component padding + font sizes (use a UI density toggle later).",
      "Max line length for instructional content: ~65ch; keep steps chunked with icons."
    ]
  },

  "color_system": {
    "notes": [
      "No purple-forward AI palette. Use ocean/teal base + warm sunshine + coral accents.",
      "Cards remain white for readability; color appears as borders, chips, icons, progress fills.",
      "All text must maintain strong contrast (WCAG AA)."
    ],
    "tokens_hsl_css": {
      "--background": "30 33% 98%",
      "--foreground": "222 47% 11%",

      "--card": "0 0% 100%",
      "--card-foreground": "222 47% 11%",

      "--popover": "0 0% 100%",
      "--popover-foreground": "222 47% 11%",

      "--primary": "188 64% 35%",
      "--primary-foreground": "0 0% 100%",

      "--secondary": "44 96% 90%",
      "--secondary-foreground": "222 47% 11%",

      "--accent": "18 87% 92%",
      "--accent-foreground": "222 47% 11%",

      "--muted": "210 20% 96%",
      "--muted-foreground": "215 16% 40%",

      "--border": "210 18% 90%",
      "--input": "210 18% 90%",
      "--ring": "188 64% 35%",

      "--destructive": "0 84% 56%",
      "--destructive-foreground": "0 0% 100%",

      "--radius": "0.9rem",

      "--chart-1": "188 64% 35%",
      "--chart-2": "18 80% 55%",
      "--chart-3": "44 85% 55%",
      "--chart-4": "210 55% 45%",
      "--chart-5": "140 45% 40%"
    },
    "hex_reference": {
      "ink": "#0B1220",
      "ocean": "#157A8C",
      "ocean_soft": "#A8D5E2",
      "sunshine": "#FFF2CC",
      "coral_soft": "#F4C7C3",
      "mint_soft": "#D4E4BC",
      "surface": "#FFFFFF",
      "bg_warm": "#FBFAF7",
      "line": "#E6E8EE"
    },
    "age_band_accents": {
      "foundation_5_8": {
        "label": "Foundation",
        "accent": "coral_soft",
        "chip_bg": "18 87% 92%"
      },
      "development_9_12": {
        "label": "Development",
        "accent": "sunshine",
        "chip_bg": "44 96% 90%"
      },
      "mastery_13_16": {
        "label": "Mastery",
        "accent": "ocean_soft",
        "chip_bg": "188 56% 92%"
      }
    },
    "gradients_restricted": {
      "allowed_background_gradients": [
        {
          "name": "hero-mist",
          "css": "radial-gradient(900px circle at 10% 0%, rgba(21,122,140,0.14), transparent 55%), radial-gradient(700px circle at 90% 10%, rgba(255,242,204,0.35), transparent 50%)",
          "usage": "Hero / top landing only; keep content cards solid"
        },
        {
          "name": "dashboard-aura",
          "css": "radial-gradient(800px circle at 20% 10%, rgba(244,199,195,0.25), transparent 55%), radial-gradient(700px circle at 85% 20%, rgba(168,213,226,0.22), transparent 55%)",
          "usage": "Dashboard header band only (max 15–20% viewport height)"
        }
      ]
    },
    "texture": {
      "noise_overlay": {
        "css": "background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E')",
        "usage": "Apply to page backgrounds only (not cards). Keep opacity <= 0.08"
      }
    }
  },

  "layout_grid": {
    "app_shell": {
      "tablet_primary": "Left rail (icons+labels) + top header + scrollable content",
      "mobile": "Bottom nav (3–5 items) + condensed header",
      "desktop": "Left rail expanded + content max-w-6xl"
    },
    "container": {
      "max_width": "max-w-6xl",
      "padding": "px-4 sm:px-6 lg:px-8",
      "section_spacing": "py-10 sm:py-12",
      "card_spacing": "gap-4 sm:gap-6"
    },
    "bento_rules": [
      "Use 12-col grid on md+; 4-col grid on mobile.",
      "Prioritize ‘Next Activity’ and ‘Continue’ actions in the top-left tile.",
      "Keep critical actions within thumb reach on tablets (center-lower zone)."
    ]
  },

  "components": {
    "component_path": {
      "shadcn_ui_existing": [
        "/app/frontend/src/components/ui/button.jsx",
        "/app/frontend/src/components/ui/card.jsx",
        "/app/frontend/src/components/ui/badge.jsx",
        "/app/frontend/src/components/ui/tabs.jsx",
        "/app/frontend/src/components/ui/progress.jsx",
        "/app/frontend/src/components/ui/avatar.jsx",
        "/app/frontend/src/components/ui/table.jsx",
        "/app/frontend/src/components/ui/dialog.jsx",
        "/app/frontend/src/components/ui/drawer.jsx",
        "/app/frontend/src/components/ui/sheet.jsx",
        "/app/frontend/src/components/ui/navigation-menu.jsx",
        "/app/frontend/src/components/ui/dropdown-menu.jsx",
        "/app/frontend/src/components/ui/select.jsx",
        "/app/frontend/src/components/ui/checkbox.jsx",
        "/app/frontend/src/components/ui/switch.jsx",
        "/app/frontend/src/components/ui/tooltip.jsx",
        "/app/frontend/src/components/ui/sonner.jsx",
        "/app/frontend/src/components/ui/calendar.jsx",
        "/app/frontend/src/components/ui/carousel.jsx",
        "/app/frontend/src/components/ui/input.jsx",
        "/app/frontend/src/components/ui/textarea.jsx",
        "/app/frontend/src/components/ui/separator.jsx",
        "/app/frontend/src/components/ui/skeleton.jsx"
      ],
      "flowbite_or_other": [
        "Flowbite: use patterns only (do not import HTML dropdowns); adapt using shadcn primitives.",
        "21st.dev: use as inspiration for bento dashboards + pricing sections; implement with Tailwind + shadcn Card/Button."
      ]
    },

    "buttons": {
      "style": "Playful / Youth (pill-ish but controlled)",
      "base": "h-12 md:h-12 px-5 rounded-xl font-semibold",
      "variants": {
        "primary": "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring",
        "secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        "ghost": "bg-transparent hover:bg-muted active:scale-[0.98]",
        "premium": "bg-[hsl(18_80%_55%)] text-white hover:bg-[hsl(18_80%_50%)]"
      },
      "micro_interaction": {
        "hover": "translate-y-[-1px] on pointer devices only",
        "press": "scale to 0.98 + shadow reduce",
        "loading": "swap label to spinner + keep width stable"
      },
      "data_testid_examples": [
        "data-testid=\"primary-cta-start-free-button\"",
        "data-testid=\"activity-player-mark-complete-button\"",
        "data-testid=\"subscription-checkout-button\""
      ]
    },

    "cards": {
      "base": "rounded-2xl border bg-card text-card-foreground shadow-[0_1px_0_rgba(11,18,32,0.06)]",
      "bento_tile": "p-4 sm:p-6",
      "sticker_badge": "Use Badge with slightly thicker border + tiny shadow to feel like a sticker",
      "content_patterns": [
        "Activity Card: icon/illustration slot (left), title + tags (center), CTA (right/bottom on mobile)",
        "Progress Card: big number + progress bar + small caption",
        "Teacher/Admin analytics card: KPI number + sparkline placeholder (later via Recharts)"
      ]
    },

    "navigation": {
      "tablet_left_rail": {
        "pattern": "Vertical rail with icons + labels; collapsible via Sheet on smaller widths",
        "use": ["navigation-menu.jsx", "sheet.jsx", "button.jsx"],
        "rail_item": "h-11 px-3 rounded-xl hover:bg-muted focus-visible:ring-2",
        "active": "bg-muted font-semibold"
      },
      "mobile_bottom_nav": {
        "pattern": "Fixed bottom bar with 4 items (Home, Activities, Progress, Profile) for Student; Parents/Teachers adjust",
        "implementation_note": "Build custom component (not provided) using Button + icons; keep 56px min height and safe-area padding"
      }
    },

    "filters_and_search": {
      "activity_filters": {
        "components": ["select.jsx", "tabs.jsx", "badge.jsx", "input.jsx"],
        "pattern": "Sticky filter row on Activity Library: Search + Age Group tabs + Difficulty select",
        "touch": "Use larger hit areas: py-3 px-4"
      }
    },

    "progress_and_gamification": {
      "progress": {
        "component": "progress.jsx",
        "style": "Rounded progress with thicker height (h-3) and animated fill",
        "states": ["0% empty state shows dotted track", "completed shows confetti micro-animation"]
      },
      "badges": {
        "component": "badge.jsx",
        "badge_wall": "Grid of badge cards; locked badges show grayscale + lock icon",
        "streak": "Use small flame-like icon (lucide) + count"
      },
      "celebration": {
        "library": "canvas-confetti",
        "install": "npm i canvas-confetti",
        "usage": "Trigger on activity completion + certificate unlocked; respect prefers-reduced-motion"
      }
    },

    "activity_player": {
      "modes": [
        "Unplugged instructions (physical)",
        "Interactive digital template (drag-drop, quizzes)"
      ],
      "structure": [
        "Top: Activity title + time estimate + age band chips",
        "Middle: Tabs (\"What you’ll do\", \"Materials\", \"Steps\", \"Try this\", \"For Teachers\")",
        "Right/Bottom: sticky CTA (Mark complete / Start interactive)"
      ],
      "components": ["tabs.jsx", "card.jsx", "badge.jsx", "button.jsx", "carousel.jsx", "dialog.jsx"],
      "instruction_ui": "Steps as numbered Card list with icons; include print-friendly view later",
      "interactive_templates": {
        "drag_drop": "Use @dnd-kit/core",
        "install": "npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities",
        "notes": "Touch-friendly drag handles; large drop zones; haptic-like feedback via sound optional"
      }
    },

    "forms": {
      "teacher_create_activity": {
        "components": ["form.jsx", "input.jsx", "textarea.jsx", "select.jsx", "switch.jsx", "checkbox.jsx", "calendar.jsx"],
        "pattern": "Wizard-like sections: Basics → Instructions → Media → Premium/Standards → Review",
        "image_upload": "Use dropzone-style area (custom) inside Card; show image preview as AspectRatio"
      }
    },

    "tables_admin": {
      "components": ["table.jsx", "dropdown-menu.jsx", "dialog.jsx", "pagination.jsx"],
      "pattern": "Sticky table header + row actions menu; bulk select; filters in a Drawer on mobile",
      "density": "Use larger row height (min-h-12) for tablet touch"
    },

    "pricing": {
      "layout": "3-tier pricing cards with clear Free vs Premium separation; highlight best value with accent border",
      "components": ["card.jsx", "badge.jsx", "button.jsx", "separator.jsx"],
      "premium_separation": "Premium card uses coral accent border + small background tint; avoid heavy gradients"
    },

    "certificates": {
      "display": "Certificate gallery as Card grid; click opens Dialog with preview + download",
      "components": ["card.jsx", "dialog.jsx", "button.jsx", "aspect-ratio.jsx"],
      "micro_interaction": "On unlock: confetti + ‘New certificate!’ toast (sonner)"
    },

    "toasts": {
      "library": "sonner",
      "path": "/app/frontend/src/components/ui/sonner.jsx",
      "usage": "Use for success/error + friendly encouragement. Keep copy short and kid-safe."
    }
  },

  "motion": {
    "library": "framer-motion",
    "install": "npm i framer-motion",
    "principles": [
      "Use motion for entrances (cards fade+slide 8px), progress fill, badge unlock.",
      "Never animate layout constantly; keep motion purposeful.",
      "Respect prefers-reduced-motion: reduce durations and disable confetti."
    ],
    "durations": {
      "fast": "120ms",
      "base": "180ms",
      "slow": "260ms"
    },
    "easings": {
      "standard": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "snappy": "cubic-bezier(0.2, 1, 0.2, 1)"
    }
  },

  "iconography": {
    "library": "lucide-react (already in typical shadcn stacks)",
    "rules": [
      "Use icons as meaning carriers (age, time, difficulty).",
      "Keep stroke width consistent; default 1.75–2.",
      "No emoji icons."
    ]
  },

  "accessibility": {
    "rules": [
      "Minimum touch target: 44x44 (prefer 48x48).",
      "Visible focus ring on all interactive elements.",
      "Don’t rely on color alone: pair color with icon/label (e.g., Premium badge + lock icon).",
      "Use simple language, especially in Student flows.",
      "Ensure alt text for images and aria-label for icon-only buttons.",
      "All interactive and key informational elements MUST include data-testid (kebab-case)."
    ]
  },

  "page_level_layouts": {
    "landing": {
      "hero": {
        "layout": "Split: left copy + CTA; right illustration/carousel of activities (tablet-friendly)",
        "hero_bg": "Use hero-mist gradient + noise overlay (<=20% viewport height)",
        "primary_cta": "Start Free",
        "secondary_cta": "View Activities"
      },
      "sections": [
        "How Unplugged Works (3 steps)",
        "Activity Categories (bento grid)",
        "For Parents / For Teachers switcher",
        "Pricing",
        "FAQ"
      ]
    },
    "auth": {
      "pattern": "Role selection first (Student/Parent/Teacher/Admin) as big cards; then form",
      "components": ["card.jsx", "tabs.jsx", "button.jsx", "input.jsx"],
      "kid_safe": "Student login: optional PIN-style (input-otp.jsx)"
    },
    "student_dashboard": {
      "top_band": "Dashboard aura gradient band (max 15–20% viewport)",
      "bento_tiles": [
        "Continue Activity",
        "Today’s Streak",
        "Badges",
        "Weekly Progress",
        "Recommended Unplugged Game"
      ]
    },
    "activity_library": {
      "pattern": "Filter row + card grid; show locked premium items with overlay",
      "empty_state": "Friendly illustration + suggestion chips"
    },
    "parent_dashboard": {
      "pattern": "Child switcher (avatars) + progress overview + subscription card",
      "emphasis": "Clarity and trust; slightly more muted accents"
    },
    "teacher_dashboard": {
      "pattern": "Classes tabs + Create Activity CTA + tables + analytics tiles",
      "forms": "Wizard sections with save draft"
    },
    "admin_dashboard": {
      "pattern": "Tables-first, minimal decoration; keep same tokens but reduce playful stickers"
    }
  },

  "image_urls": {
    "hero_and_marketing": [
      {
        "url": "https://images.pexels.com/photos/6482238/pexels-photo-6482238.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Kid using tablet for learning (use as secondary visual in landing carousel; crop to avoid distracting background)",
        "category": "landing/hero"
      },
      {
        "url": "https://images.pexels.com/photos/33765933/pexels-photo-33765933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Student learning on tablet outdoors (use in ‘learn anywhere’ section, not as hero primary)",
        "category": "landing/feature"
      }
    ],
    "illustration_guidance": {
      "note": "Prefer custom SVG illustrations (simple shapes + friendly characters) to avoid inconsistent stock photography. If needed, use unbranded classroom/activity photos sparingly.",
      "style": "Flat illustration with soft outlines; limited palette accents (ocean/coral/sunshine)."
    }
  },

  "implementation_notes": {
    "css_updates_required": [
      "Replace default shadcn tokens in /app/frontend/src/index.css :root with tokens_hsl_css above.",
      "Remove/ignore CRA demo styles in /app/frontend/src/App.css (App-header centering + dark background) to avoid centered layouts."
    ],
    "add_global_font_import": {
      "where": "public/index.html or CSS import",
      "snippet": "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"/>\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin/>\n<link href=\"https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Space+Grotesk:wght@500;600;700&display=swap\" rel=\"stylesheet\"/>"
    },
    "tailwind_patterns": {
      "page_background": "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
      "hero_band": "relative overflow-hidden before:absolute before:inset-0 before:[background:var(--hero-gradient)] before:opacity-100",
      "noise": "after:absolute after:inset-0 after:pointer-events-none after:[background-image:var(--noise)] after:opacity-100"
    },
    "testid_rule": {
      "convention": "kebab-case, role-based",
      "examples": [
        "data-testid=\"role-picker-student-card\"",
        "data-testid=\"activity-library-filter-age-tabs\"",
        "data-testid=\"teacher-create-activity-save-draft-button\"",
        "data-testid=\"admin-users-table\""
      ]
    }
  },

  "instructions_to_main_agent": [
    "DO NOT keep centered demo layout from App.css; switch to left-aligned, content-first layout.",
    "Update index.css design tokens (HSL) to match the new kid-friendly ocean/coral/sunshine system.",
    "Implement tablet-first shell: left rail + top header; mobile bottom nav for Student.",
    "Use shadcn components from /src/components/ui only for inputs, dropdowns, dialogs, calendar, etc.",
    "Apply restrained gradients only to hero/header bands (<=20% viewport). Cards remain solid white.",
    "Add micro-interactions: button press scale, card hover lift (pointer only), progress animations, confetti on completion; respect prefers-reduced-motion.",
    "Ensure every interactive and key informational element has data-testid attributes (kebab-case).",
    "Keep touch targets >=44px; prefer 48px for primary actions."
  ],

  "general_ui_ux_design_guidelines_appendix": "<General UI UX Design Guidelines>\n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
