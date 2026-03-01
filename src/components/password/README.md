# Password Input – Usage Guide

## Installation

No additional dependencies required. Uses existing shadcn/ui primitives.

## Quick Start

### 1. Import Component

```tsx
import { PasswordInput } from "@/components/input/password"
```

### 2. Basic Usage

```tsx
const [password, setPassword] = useState("")

<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

### 3. With Strength Indicator

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showStrength
  showStrengthFeedback
/>
```

## Integration Examples

### With react-hook-form

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PasswordInput } from "@/components/input/password"

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function Form() {
  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <div>
      <PasswordInput
        {...register("password")}
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

### With Field Component (shadcn)

```tsx
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { PasswordInput } from "@/components/input/password"

<Field>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput
    {...register("password")}
    error={!!errors.password}
    showStrength
  />
  <FieldError>{errors.password?.message}</FieldError>
</Field>
```

## Advanced Usage

### Custom Strength Validation

```tsx
import { calculatePasswordStrength } from "@/lib/validations/password"

const strength = calculatePasswordStrength(password)

if (!strength.isStrong) {
  setError("password", {
    message: "Password is not strong enough",
  })
}
```

### Standalone Strength Indicator

```tsx
import { PasswordStrength } from "@/components/input/password/strength"

<Input type="password" {...register("password")} />
<PasswordStrength password={password} showFeedback />
```

## Customization

### Custom Styling

```tsx
<PasswordInput
  className="custom-class"
  value={password}
  onChange={onChange}
/>
```

### Hide Strength Feedback

```tsx
<PasswordInput
  showStrength
  showStrengthFeedback={false}
/>
```

## Best Practices

1. **Always show strength indicator for registration/password reset**
2. **Use error prop to indicate validation errors**
3. **Provide clear password requirements in help text**
4. **Consider password managers (autocomplete="current-password")**
5. **Don't enforce maximum length (use reasonable limit like 128)**

## Migration from Standard Input

```diff
- <Input type="password" {...props} />
+ <PasswordInput {...props} showStrength />
```
