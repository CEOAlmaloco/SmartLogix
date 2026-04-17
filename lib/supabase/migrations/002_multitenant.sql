-- Tabla `pyme`

CREATE TABLE public.pyme (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla `pyme_user`

CREATE TABLE public.pyme_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pyme_id, user_id)
);