# Substrate to Harvest — Game Design Document

**Working Title:** Substrate to Harvest
**Alternate Titles to Consider:** Mycelium Empire · Fruit & Flush · The Grow Cycle · Spawn Point (mycology pun) · Crowe's Cultivation · Fungiverse
**Recommended Final Title:** **Substrate to Harvest** (clean, descriptive, evocative)

**Publisher:** Southwest Mushrooms · Crowe Logic, Inc.
**Platform:** HTML5 (browser, mobile-first)
**Version:** 1.0.0
**Target Audience:** Mycology hobbyists, tycoon-game fans, curious learners age 12+

---

## 1. Vision Statement

*Southwest Mushrooms: Substrate to Harvest* is a mushroom cultivation tycoon that plays like a game and teaches like a course. Every mechanic — from choosing pasteurization vs. sterilization to identifying trichoderma — reflects real commercial cultivation. Players start with a single tote in a Phoenix garage and scale to a facility shipping worldwide, mirroring the real Southwest Mushrooms origin story.

**Design pillar:** *"If you can win this game, you can grow real mushrooms."*

---

## 2. Core Loop (60-second fun test)

1. **Inoculate** — Pick species and substrate, mix spawn into substrate block.
2. **Colonize** — Watch mycelium consume the substrate. Manage temperature and cleanliness. Contamination risk ticks up if you cut corners.
3. **Fruit** — Move to fruiting chamber. Dial in humidity, temperature, fresh air exchange (FAE), and light.
4. **Harvest** — Snip mushrooms at the right maturity (satisfying tactile moment).
5. **Sell** — Farmers market, restaurants, online, wholesale. Reinvest.

**Time to first harvest:** ~90 seconds real time (compressed from 14 real days).
**Time to full first-run understanding:** ~5 minutes.

---

## 3. Species Library (v1)

Each species has *real* parameters. Colonization temps, fruiting temps, humidity, and FAE requirements match commercial cultivation guides.

| Species | Scientific | Difficulty | Colonization Temp | Colonization Days | Fruit Temp | Humidity | FAE | Yield (BE %) |
|---------|-----------|-----------|-------------------|-------------------|-----------|----------|-----|-------------|
| Pearl Oyster | *Pleurotus ostreatus* | ★ | 72-78°F | 10-14 | 55-65°F | 85-95% | High | 75-100% |
| Blue Oyster | *P. ostreatus var. columbinus* | ★ | 65-75°F | 10-14 | 45-60°F | 85-95% | High | 75-100% |
| Lion's Mane | *Hericium erinaceus* | ★★ | 70-75°F | 14-21 | 60-65°F | 85-92% | Medium | 50-75% |
| Pioppino | *Cyclocybe aegerita* | ★★ | 72-78°F | 14-21 | 55-65°F | 85-90% | Medium | 60-80% |
| Chestnut | *Pholiota adiposa* | ★★ | 72-78°F | 14-21 | 55-65°F | 85-90% | Medium | 60-80% |
| King Trumpet | *Pleurotus eryngii* | ★★★ | 72-78°F | 14-21 | 55-65°F | 85-92% | Low-Med | 60-90% |
| Shiitake | *Lentinula edodes* | ★★★ | 70-78°F | 30-60 | 55-65°F | 80-90% | Medium | 50-75% |
| Reishi | *Ganoderma lucidum* | ★★★★ | 78-85°F | 21-30 | 75-85°F | 90-95% | Low (CO2 for antlers) | 30-50% |
| Chicken of the Woods | *Laetiporus sulphureus* | ★★★★ | 75-85°F | 30-45 | 65-75°F | 85-90% | Medium | Variable |
| Cordyceps militaris | *Cordyceps militaris* | ★★★★★ | 68-72°F | 21-30 | 68-72°F | 90-95% | Low, need light | Low but premium |

**Unlock progression:** Oyster → Lion's Mane → Chestnut → Pioppino → King Trumpet → Shiitake → Blue Oyster → Reishi → Chicken of the Woods → Cordyceps militaris. Each new species requires reputation, cash, and often specific equipment.

---

## 4. Substrate Recipes

Substrate choice affects yield, contamination risk, prep time, and cost.

| Recipe | Cost | Prep | Contam. Risk Modifier | Yield Modifier | Notes |
|--------|------|------|----------------------|----------------|-------|
| Straw (pasteurized) | Low | Fast | +5% | -10% | Oysters only. Beginner-friendly. |
| Hardwood Sawdust | Med | Slow (sterilize) | Baseline | Baseline | Most species. |
| Masters Mix (50/50 hardwood + soy hull) | High | Slow | -5% | +25% | Highest yields. Requires PC or autoclave. |
| Supplemented Hardwood (+bran) | Med-High | Slow | +15% (more nutrients = more contam risk) | +30% | Requires excellent sterile technique. |
| Coco Coir + Vermiculite | Med | Fast (pasteurize) | +10% | -20% | Simple. Not commercial. |
| Whole Grain (rye/oats) | Low-Med | Slow | +5% | N/A - for spawn | Master's mix spawn requires this. |

---

## 5. Contamination Mechanics

Every batch has a rolling **contamination risk** score (0-100). Risk increases based on:
- Substrate type (nutritious substrates attract contaminants)
- Sterile technique (still air box vs. flow hood)
- Environmental cleanliness (grow room upgrades reduce baseline)
- Humidity/temperature outside ideal range
- Time (longer colonization = more exposure)

When a contamination event triggers, the player must **identify** the contaminant. Correct identification within 24 in-game hours may save part of the batch (or teach the player for next time). Wrong identification means the whole batch is lost.

### Contaminants (real, learnable)

| Contaminant | Visual Cue | Cause | Save Method |
|-------------|-----------|-------|-------------|
| **Trichoderma** (green mold) | Bright emerald green patches | Poor sterile technique | Toss immediately, sanitize area |
| **Cobweb Mold** | Gray, fuzzy, spreading fast | High humidity + poor FAE | Reduce humidity, increase FAE (sometimes saveable) |
| **Bacterial Blotch** | Yellow-brown wet spots on caps | Wet caps + poor air | Improve FAE, dry between mistings |
| **Wet Rot / Bacterial Wet Blob** | Dark wet patches, sour smell | Over-watering, contamination in substrate | Toss |
| **Neurospora** (orange bread mold) | Bright orange, spreads via spores | Nuclear-level contamination event | Toss and evacuate area |
| **Pin Head Mold (Aspergillus/Penicillium)** | Small dark speckles | Airborne, sterile technique failure | Toss |

Each contamination event **unlocks a Codex entry** with visual reference, real cause, and prevention tactics.

---

## 6. Progression / Business Tiers

Career mode loosely mirrors Michael Crowe's actual arc.

### Tier 1: Garage Hobbyist (Days 1-14)
- **Setup:** Shoebox tub in a garage, still air box (SAB), pressure cooker.
- **Species:** Oyster only.
- **Sales:** Farmers market (Saturday only, small volumes).
- **Challenge:** Phoenix ambient heat (95°F) is a real problem. Contamination is common.
- **Goal:** Complete 5 successful batches. Save $500 for tier upgrade.

### Tier 2: Basement Operation (Days 15-45)
- **Unlocks:** Grow tent, laminar flow hood (LFH), Lion's Mane, hardwood substrate.
- **Sales:** Farmers market + first restaurant account.
- **New mechanic:** Restaurant contracts (weekly volume commitments — miss the deadline, lose reputation).
- **Goal:** Land two restaurant accounts. Save $3,000.

### Tier 3: Dedicated Grow Room (Days 46-90)
- **Unlocks:** Climate-controlled room, autoclave, Chestnut, Pioppino, King Trumpet, online store, spawn production.
- **Sales:** Farmers market, restaurants, online orders (grow kits + fresh).
- **New mechanic:** Grow kits (recurring passive revenue).
- **Goal:** Hit $10,000 net worth.

### Tier 4: Commercial Facility (Days 91-180)
- **Unlocks:** Multi-room facility, HVAC automation, Shiitake, Reishi, wholesale accounts, employees.
- **Sales:** All previous + wholesale distributor + regional shipping.
- **New mechanic:** Labor — hire and train workers, monitor efficiency.
- **Goal:** Hit $50,000 net worth. First national wholesale contract.

### Tier 5: Global Brand (Days 181+)
- **Unlocks:** Cordyceps militaris, Chicken of the Woods, custom species research, international shipping, brand licensing.
- **New mechanic:** R&D — research custom substrate blends, breed new strains.
- **Goal:** Endgame is open-ended. Leaderboard for peak monthly revenue.

---

## 7. Progression Tree (Simplified)

```
[Start: $200, Oyster Culture]
    │
    ├─ Complete 5 batches ──> Unlock Hardwood substrate
    ├─ Earn $500 ──────────> Unlock Grow Tent
    ├─ Earn $1,000 ────────> Unlock Lion's Mane
    ├─ Earn $2,000 ────────> Unlock Laminar Flow Hood
    ├─ Land 2 restaurants ─> Unlock Chestnut + Pioppino
    ├─ Earn $5,000 ────────> Unlock Climate-Controlled Room
    ├─ Earn $10,000 ───────> Unlock King Trumpet + Autoclave
    ├─ Reputation 500+ ────> Unlock Shiitake
    ├─ Earn $25,000 ───────> Unlock Reishi + Multi-room
    ├─ Earn $50,000 ───────> Unlock Wholesale + Employees
    └─ Earn $100,000 ──────> Unlock Cordyceps + Global shipping
```

---

## 8. Environmental Mechanics

### Phoenix Heat Challenge
Ambient outdoor temperature swings between 60°F (winter night) and 115°F (summer day). Cooling costs are a real ongoing expense. Winter is easier and cheaper — a deliberate seasonal rhythm that mirrors the real Sonoran cultivation experience.

### Room Conditions (per grow space)
- **Temperature** (°F)
- **Humidity** (%)
- **Fresh Air Exchange** (air changes/hour)
- **Light** (hours/day — most species need indirect light for fruiting cues)

Each species has a "green zone" for all four. Green zones for fruiting are often very different from colonization. Getting them wrong produces realistic defects:
- **Too much CO2 (low FAE):** Long stems, small caps (oysters become "sticks").
- **Low humidity:** Cracked caps, crusty surfaces.
- **High humidity + low FAE:** Bacterial blotch (yellow spots).
- **Wrong temperature:** Aborted pins, no primordia.

---

## 9. Sales Channels

| Channel | Volume | Margin | Reliability | Unlock |
|---------|--------|--------|-------------|--------|
| Farmers Market | Low | High (retail $12-18/lb) | Weekly (Sat only) | Tier 1 |
| Restaurant Accounts | Med | Med ($10-14/lb) | Weekly, contract-based | Tier 2 |
| Online Fresh Orders | Low-Med | High (+ shipping) | Daily | Tier 3 |
| Grow Kits (retail) | Med | Very High | Passive, restocks weekly | Tier 3 |
| Wholesale Distributor | High | Low ($6-8/lb) | Daily, contract-based | Tier 4 |
| Regional Shipping | Med-High | Med | Every 2 days | Tier 4 |
| International Shipping | Med | High | Weekly | Tier 5 |

---

## 10. Modes

- **Career (main mode):** Progress through five tiers, open-ended endgame.
- **Sandbox:** Unlimited money and unlocks. Experiment freely. Great for learning specific species.
- **Contamination Rush:** 60-second minigame. Identify contaminants on a wall of blocks before they spread. Leaderboard.
- **Daily Grow:** Shared daily seed. Same starting conditions, same event sequence for all players. Compete on total revenue in 5 in-game days.

---

## 11. Grower's Codex

An unlockable in-game encyclopedia. Entries unlock as species and techniques are used. Written in the Southwest Mushrooms voice — expert, warm, occasionally cheeky, always specific. Every entry references *The Mushroom Grower* series as the deeper resource.

**Codex categories:**
- Species profiles (parameters + real photos in v2)
- Substrate recipes
- Contaminants (with visual identification)
- Techniques (pasteurization, sterilization, agar, LC, grain-to-grain)
- Equipment guides
- Business fundamentals

---

## 12. Brand Integration

- **Splash:** Southwest Mushrooms logo, "A game by Crowe Logic, Inc." + Michael Crowe credit.
- **Codex entries** occasionally cite *The Mushroom Grower* series ("For the full protocol, see Vol. 2, Ch. 7").
- **End of first successful career run:** One soft CTA: "Want to grow for real? Join Michael's Skool community." — never before, never during gameplay.
- **Achievements** may unlock discount codes for the Southwest Mushrooms store (v2).

**No ads. No pop-ups. No promotional interstitials during gameplay.** Every branded element is either background flavor or an earned moment at a natural break point.

---

## 13. Visual & Audio Direction

**Visual:**
- 2D top-down/isometric style using inline SVG + CSS transforms.
- Palette: warm earth (mycelium white `#f4e8d0`, desert gold `#c9a961`, deep umber `#4a3728`, cool contamination greens/oranges for warning).
- Mushrooms drawn distinctly per species — a Lion's Mane looks like a Lion's Mane, a Reishi like a Reishi.
- Clean sans-serif typography, monospace for numbers, small serif accents for the Codex.

**Audio (v2 — v1 is silent by default with hooks in place):**
- Ambient shop hum, mister hiss, fan whoosh
- Satisfying feedback: harvest snip, contamination alarm (dread!), cash register cha-ching
- Chill lo-fi background loop

**UI:**
- Mobile-first. Bottom nav bar. Big tap targets (44px+).
- Dark warm theme by default.
- Numbers monospace so scanning is fast.

---

## 14. Technical Specifications

- **Single HTML file** — HTML, CSS, JS inline. Zero external dependencies. Zero build step.
- **File size target:** < 200KB.
- **Framerate target:** 60fps on mid-range mobile.
- **State management:** Plain JavaScript object. No framework.
- **Persistence:** In-memory + export/import save codes (base64-encoded JSON). No `localStorage` dependency for portability across contexts.
- **Rendering:** DOM + inline SVG. No canvas required for v1 — makes it perfectly responsive and pixel-crisp on all devices.
- **Time system:** Ticks driven by `requestAnimationFrame`. 1 real second = 4 game hours default. Player can pause, fast-forward 2x/4x/8x, or "skip to next event."

---

## 15. Quality Bar (must pass before ship)

- ✅ Core loop is fun in the first 60 seconds
- ✅ Full run from spore to first sale in under 5 minutes
- ✅ Every species behaves distinctly (a Reishi does not play like an Oyster)
- ✅ Contamination feels fair — the player always could have prevented it
- ✅ Real cultivation knowledge is embedded in every mechanic
- ✅ Passes three-persona test: mycology hobbyist, tycoon fan, 12-year-old — all have fun and learn something real
- ✅ Zero external dependencies, works offline after first load
- ✅ Mobile-responsive, one-thumb playable

---

## 16. Post-v1 Roadmap (see CHANGELOG.md)

- Audio pass (ambient + SFX + music)
- Real Southwest Mushrooms product unlock codes as achievements
- Multiplayer trading (spawn, cultures, tips)
- Seasonal events (Fall Chestnut boom, Winter cold benefits)
- MycelGlow product tie-ins (bioluminescent species mini-arc)
- Real photo Codex with entries by Michael
- Localizations (Spanish first, given SW Mushrooms' bilingual customer base)
