# Component library

All components live in `packages/ui/src/components/ui` and are imported through
the `@repo/ui` workspace alias. They are standard
[shadcn/ui](https://ui.shadcn.com) components built on
[Radix](https://radix-ui.com) primitives, so they are unstyled-by-default and
composed with Tailwind utility classes.

A live tour of the library is available at `/components` in the web app.

## Included components

| Component    | Import path                            | Notes                                            |
| ------------ | -------------------------------------- | ------------------------------------------------ |
| Accordion    | `@repo/ui/components/ui/accordion`     | Single or multiple panels                        |
| Alert        | `@repo/ui/components/ui/alert`         | `Alert`, `AlertTitle`, `AlertDescription`        |
| Avatar       | `@repo/ui/components/ui/avatar`        |                                                  |
| Badge        | `@repo/ui/components/ui/badge`         | `default`, `secondary`, `outline`, `destructive` |
| Button       | `@repo/ui/components/ui/button`        | Variants and sizes via `cva`                     |
| Card         | `@repo/ui/components/ui/card`          | Header, title, description, content, footer      |
| Checkbox     | `@repo/ui/components/ui/checkbox`      |                                                  |
| Dialog       | `@repo/ui/components/ui/dialog`        |                                                  |
| DropdownMenu | `@repo/ui/components/ui/dropdown-menu` |                                                  |
| Form         | `@repo/ui/components/ui/form`          | react-hook-form bindings                         |
| Input        | `@repo/ui/components/ui/input`         |                                                  |
| Label        | `@repo/ui/components/ui/label`         |                                                  |
| Progress     | `@repo/ui/components/ui/progress`      |                                                  |
| Select       | `@repo/ui/components/ui/select`        |                                                  |
| Separator    | `@repo/ui/components/ui/separator`     |                                                  |
| Sheet        | `@repo/ui/components/ui/sheet`         | Mobile navigation                                |
| Skeleton     | `@repo/ui/components/ui/skeleton`      | Loading placeholders                             |
| Sonner       | `@repo/ui/components/ui/sonner`        | Re-exports Sonner's `Toaster`                    |
| Switch       | `@repo/ui/components/ui/switch`        |                                                  |
| Table        | `@repo/ui/components/ui/table`         |                                                  |
| Tabs         | `@repo/ui/components/ui/tabs`          |                                                  |
| Textarea     | `@repo/ui/components/ui/textarea`      |                                                  |
| Tooltip      | `@repo/ui/components/ui/tooltip`       |                                                  |

## Adding a component

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

The registry sometimes writes a bare `from "cn"` import. Point it at the
workspace helper instead:

```ts
import { cn } from "@repo/ui/lib/utils";
```

Then format and type-check:

```bash
pnpm format
pnpm --filter @repo/ui check-types
```

## Forms

`Form` wraps [react-hook-form](https://react-hook-form.com). Pair it with a Zod
schema from `@repo/validators` through `zodResolver`. See
`apps/web/components/contact-form.tsx` for a complete example:

```tsx
const form = useForm({ resolver: zodResolver(contactFormSchema) });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>;
```

`FormMessage` renders the field error automatically, and `form.setError` lets
you surface server-side errors returned by a server action.
