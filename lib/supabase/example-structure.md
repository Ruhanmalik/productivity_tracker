# Option 2: Split into Separate Files (Better for larger projects)

Instead of one `server.ts`, you can organize by concern:

```
lib/supabase/
  ├── server.ts          # Base client creation
  ├── auth.ts            # Authentication functions
  ├── database.ts        # Database query functions
  ├── storage.ts         # File storage functions
  └── index.ts           # Barrel export (optional)
```

## Example structure:

### lib/supabase/server.ts

```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase env vars");
  }

  return createSupabaseClient(url, anonKey);
};
```

### lib/supabase/auth.ts

```typescript
import { createClient } from "./server";

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
```

### lib/supabase/database.ts

```typescript
import { createClient } from "./server";

export const getInstruments = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("instruments").select();
  if (error) throw error;
  return data;
};
```

### lib/supabase/index.ts (optional barrel export)

```typescript
// Re-export everything for convenience
export * from "./server";
export * from "./auth";
export * from "./database";
```

Then you can import like:

```typescript
import { createClient, getUser } from "@/lib/supabase";
// or
import { getInstruments } from "@/lib/supabase/database";
```
