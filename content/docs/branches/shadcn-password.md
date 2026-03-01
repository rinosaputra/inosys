---
title: 'shadcn/password'
description: 'Add PasswordInput component (shadcn/ui primitives) with optional strength indicator + guide.'
pubDate: 'Mar 01 2026'
heroImage: '/images/lagoon-3.svg'
---

Branch ini menambahkan komponen **PasswordInput** berbasis **shadcn/ui primitives** (tanpa dependency tambahan) untuk kebutuhan form login/registrasi yang rapi dan konsisten.

Tujuan utama:
- Password input yang reusable
- UX lebih baik (toggle show/hide, indikator strength opsional)
- Integrasi mudah dengan form library (contoh: react-hook-form)
- Dokumentasi pemakaian yang jelas

## Scope

- Komponen `PasswordInput`:
  - Controlled input (value/onChange)
  - Props untuk state error (`error`)
  - Opsi: `showStrength` dan `showStrengthFeedback`
- Komponen pendukung (jika ada):
  - `PasswordStrength` / indikator kekuatan password
  - Utility `calculatePasswordStrength` (jika dipakai)
- Dokumentasi usage guide

## File/Modules (expected)

> Sesuaikan path jika struktur di repo berbeda.

- `src/components/password/*`
  - `PasswordInput` sebagai entry point
  - (opsional) `strength.tsx` untuk indikator
- `src/lib/validations/password.ts`
  - (opsional) fungsi `calculatePasswordStrength`

## Usage (Quick Start)

```tsx
import { useState } from 'react'
import { PasswordInput } from '#/components/password'

export function Example() {
  const [password, setPassword] = useState('')

  return (
    <PasswordInput
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  )
}
```

### With Strength Indicator

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showStrength
  showStrengthFeedback
/>
```

### With react-hook-form (example)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PasswordInput } from '#/components/password'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export function Form() {
  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <div>
      <PasswordInput
        {...register('password')}
        error={!!errors.password}
        showStrength
      />
      {errors.password && (
        <p className="text-sm text-destructive">{errors.password.message}</p>
      )}
    </div>
  )
}
```

## Best Practices

1. Gunakan `showStrength` untuk halaman registrasi / reset password.
2. Set atribut autocomplete:
   - login: `autocomplete="current-password"`
   - register/reset: `autocomplete="new-password"`
3. Jangan bikin aturan password berlebihan. Minimal 8–12 chars + feedback yang jelas.
4. Pastikan komponen tetap accessible:
   - label jelas
   - focus ring terlihat
   - tombol show/hide punya aria-label

## Acceptance Checklist

- [ ] Komponen bisa dipakai pada halaman login & register tanpa style pecah
- [ ] Tidak ada dependency baru yang tidak diperlukan
- [ ] `pnpm dev` berjalan normal
- [ ] Minimal 1 test/unit sederhana (opsional tapi disarankan)
- [ ] Docs pemakaian jelas dan sesuai contoh

## Commit Convention

Ikuti aturan repo: hanya `feat:`, `fix:`, `chore:`.

Contoh:
- `feat: add shadcn-based password input component`
- `chore: add usage guide for password input`
---
