# Plan: Custom Country & City Selection

## Overview

Add a "Custom selection" mode to the settings panel that lets the user hand-pick which countries
(and, when mode is *cities*, which cities) are included in the quiz.
The existing "By region" flow is kept intact; custom selection is an opt-in alternative.

---

## 1. State – `src/store/settingsStore.ts`

Add three new fields to `SettingsState` and corresponding setters:

| Field | Type | Default | Purpose |
|---|---|---|---|
| `useCustomSelection` | `boolean` | `false` | Whether custom selection is active |
| `selectedCountries` | `string[]` | `[]` | ISO codes of hand-picked countries |
| `selectedCities` | `string[]` | `[]` | City IDs of hand-picked cities |

New setters: `setUseCustomSelection`, `setSelectedCountries`, `setSelectedCities`.

All new fields must be included in the Zustand `persist` config so selections survive page refresh.

---

## 2. Filtering – `src/utils/filterByRegion.ts`

Add two new exported functions (leave existing ones unchanged):

```ts
filterCountriesByCustomSelection(selectedCountries: string[]): Country[]
// returns countries whose iso is in selectedCountries

filterCitiesByCustomSelection(selectedCountries: string[], selectedCities: string[]): City[]
// returns cities whose countryIso is in selectedCountries
// AND whose id is in selectedCities
```

---

## 3. Quiz engine – `src/hooks/useQuizEngine.ts`

In the `useMemo` that builds `quizQuestions`, add a branch:

```ts
if (useCustomSelection) {
  if (mode === 'countries') {
    items = filterCountriesByCustomSelection(selectedCountries);
  } else {
    items = filterCitiesByCustomSelection(selectedCountries, selectedCities);
  }
} else {
  // existing region + difficulty path
}
```

`useCustomSelection`, `selectedCountries`, and `selectedCities` must be read from `useSettingsStore`
and added to the `useMemo` dependency array.

---

## 4. New components

### 4a. `src/components/Settings/CountrySelector.tsx`

Displays the full country list (197 entries) for the user to check/uncheck.

**Layout:**
- Search input at the top (`<input type="text">`) that filters visible countries by `nameEn`.
- Grouped by `region`. Each group has:
  - A region header row with a **Select all / Deselect all** checkbox.
  - Collapsible sub-list (collapsed by default when there are many regions). An expand/collapse chevron button on the header toggles visibility.
- Each country row: `<input type="checkbox">` + country name (`nameEn`).
- Countries are sorted alphabetically within each region.
- A summary line at the bottom: *"X countries selected"*.

**Props:**
```ts
interface CountrySelectorProps {
  selectedCountries: string[];       // current ISO selection
  onChange: (isos: string[]) => void;
}
```

**Behaviour:**
- Checking the region header selects all currently *visible* (search-filtered) countries in that region.
- Unchecking the region header deselects all countries in that region (regardless of search filter).
- Individual country toggles add/remove a single ISO code.

---

### 4b. `src/components/Settings/CitySelector.tsx`

Displayed only when mode is `'cities'` *and* `useCustomSelection` is `true`.

**Layout:**
- Search input that filters visible cities by `nameEn`.
- Grouped by country (`countryIso` → `nameEn`). Each group has:
  - Country header with **Select all / Deselect all** checkbox.
  - Collapsible sub-list.
- Each city row: `<input type="checkbox">` + city name (`nameEn`) + type badge (`capital` / `major`).
- Cities sorted: capitals first, then majors alphabetically.
- A summary line: *"X cities selected"*.

**Props:**
```ts
interface CitySelectorProps {
  selectedCountries: string[];  // only cities from these countries are shown
  selectedCities: string[];
  onChange: (cityIds: string[]) => void;
}
```

**Behaviour:**
- Only cities whose `countryIso` is in `selectedCountries` are ever shown.
- When the parent `selectedCountries` changes and some cities now belong to a deselected country,
  those city IDs should be removed from `selectedCities` automatically (handled in the parent, see §5).
- Checking the country header selects all visible (search-filtered) cities for that country.

---

## 5. Settings panel – `src/components/Settings/SettingsPanel.tsx`

### New "Selection method" control

Add a toggle row directly below the existing **Regions** section:

```
Selection method:  [ By region ]  [ Custom ]
```

- When **By region** is active → show the existing region checkboxes (current behaviour).
- When **Custom** is active → hide the region checkboxes and show `CountrySelector`.
  - If mode is *cities*, also show `CitySelector` below `CountrySelector` (after the user has at least one country selected).

### Side-effect on `selectedCountries` change

When the user deselects a country in `CountrySelector`, derive the new valid `selectedCities` by
keeping only IDs whose `countryIso` is still in `selectedCountries`, then call `setSelectedCities`.
This keeps the two lists consistent.

### Panel height / scroll

The panel `max-h` should be increased (e.g. `max-h-[80vh]`) or made responsive to accommodate the
longer country list. Both `CountrySelector` and `CitySelector` should have their own inner scroll
container (`max-h-64 overflow-y-auto`) so they don't blow out the panel.

### Validation

The **Start** button should be disabled (and show a tooltip) when custom selection is active but:
- No countries are selected, **or**
- Mode is *cities* and no cities are selected.

---

## 6. i18n – `src/i18n.ts` (or wherever translations live)

Add new translation keys for both `en` and `fi`:

| Key path | EN | FI |
|---|---|---|
| `settings.customSelection` | "Custom" | "Mukautettu" |
| `settings.byRegion` | "By region" | "Alueen mukaan" |
| `settings.selectionMethod` | "Selection method" | "Valintamenetelmä" |
| `settings.searchCountries` | "Search countries…" | "Hae maita…" |
| `settings.searchCities` | "Search cities…" | "Hae kaupunkeja…" |
| `settings.selectAll` | "Select all" | "Valitse kaikki" |
| `settings.deselectAll` | "Deselect all" | "Poista kaikki" |
| `settings.countriesSelected` | "{n} countries selected" | "{n} maata valittu" |
| `settings.citiesSelected` | "{n} cities selected" | "{n} kaupunkia valittu" |
| `settings.noCitiesWarning` | "Select at least one city" | "Valitse vähintään yksi kaupunki" |
| `settings.noCountriesWarning` | "Select at least one country" | "Valitse vähintään yksi maa" |

---

## 7. File change summary

| File | Change type |
|---|---|
| `src/store/settingsStore.ts` | Extend state + setters |
| `src/utils/filterByRegion.ts` | Add 2 new filter functions |
| `src/hooks/useQuizEngine.ts` | Branch on `useCustomSelection` |
| `src/components/Settings/CountrySelector.tsx` | **New file** |
| `src/components/Settings/CitySelector.tsx` | **New file** |
| `src/components/Settings/SettingsPanel.tsx` | Add toggle + render new components |
| `src/i18n.ts` (or translation file) | Add new keys |

---

## 8. Implementation order

1. `settingsStore.ts` – extend state (no UI impact, safe first step).
2. `filterByRegion.ts` – add new filter functions (pure utility, easy to test).
3. `useQuizEngine.ts` – wire new filter functions (quiz logic).
4. `CountrySelector.tsx` – build and test in isolation.
5. `CitySelector.tsx` – build and test in isolation.
6. `SettingsPanel.tsx` – integrate toggle + new components + validation.
7. `i18n.ts` – add translation keys (can be done alongside step 6).

---

## 9. Edge cases to handle

- **Custom mode, 0 countries selected** → quiz cannot start; show warning.
- **Custom mode, cities mode, 0 cities selected** → quiz cannot start; show warning.
- **User switches from custom → by-region** → `selectedCountries` / `selectedCities` are preserved in
  the store but ignored. They are restored if the user switches back to custom.
- **User changes mode (countries ↔ cities) while custom is active** → `selectedCountries` is unchanged;
  `selectedCities` retains its value (cities selection is simply not used in countries mode).
- **Question count exceeds pool size** → `useQuizEngine` already slices with `slice(0, questionCount)`;
  if the pool is smaller the quiz just uses all available questions. Consider capping the
  `questionCount` selector to `Math.min(questionCount, pool.length)` and showing the actual count.
