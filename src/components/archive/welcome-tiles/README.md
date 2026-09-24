# Archived welcome tiles

The homepage chooser used two `WelcomeScreen` cards (photo, title, black button) before the 3D travel cards. This copy is unused. The live component is still `src/components/ui/welcome-screen.tsx`.

To put these tiles back on `/`:

1. In `src/app/page.tsx`, import `WelcomeScreen` from `@/components/ui/welcome-screen` (or from this folder).
2. Keep `SonarGrid` if that is still the page background.
3. Render one card per role:

```tsx
<WelcomeScreen
  className="w-full max-w-sm shrink-0 min-[880px]:w-96"
  imageUrl="/roles/agency.jpg"
  imageAlt={t.home.agencyImageAlt}
  title={t.home.agencyButton}
  buttonText={t.home.agencyCta}
  href="/for-agencies"
/>
<WelcomeScreen
  className="w-full max-w-sm shrink-0 min-[880px]:w-96"
  imageUrl="/roles/caregiver.jpg"
  imageAlt={t.home.caregiverImageAlt}
  imagePosition="center top"
  title={t.home.caregiverButton}
  buttonText={t.home.caregiverCta}
  href="/for-caregivers"
/>
```

The logo and “Who are you?” stay dark on the light Sonar Grid. Do not pass `onDark` to `LangToggle` or `text-white` to `Mark`.
