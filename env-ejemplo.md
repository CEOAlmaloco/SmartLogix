#SmartLogix — plantilla .env.local
#Copiar a .env.local en la raíz:  copy env-ejemplo.md .env.local
#No commitear .env.local (está en .gitignore)


#Supabase (obligatorio)Dashboard → Project Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxxxxxx


#Brevo — correo de bienvenida al registrar PYME (opcional)
#Sin BREVO_API_KEY y BREVO_SENDER_EMAIL el registro funciona igual.
#BREVO_SENDER_EMAIL debe estar verificado en Brevo.

BREVO_API_KEY=xkeysib-xxxxxxxx
BREVO_SENDER_NAME=SmartLogix
BREVO_SENDER_EMAIL=noreply@tudominio.com


#Resend — formulario de contacto (opcional)
#Sin RESEND_API_KEY el contacto abre mailto: en el navegador.

RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=SmartLogix <onboarding@resend.dev>
CONTACT_INBOX_EMAIL=contacto@tudominio.com


#Marketplace adapter Docker (opcional, futuro BFF)
#Probar hoy: docker compose up -d  →  http://localhost:3001/health

MARKETPLACE_ADAPTER_URL=http://localhost:3001
ADAPTER_API_TOKEN=


#Docker Compose — mismo archivo .env en raíz (opcional, solo docker compose)
#Sin este bloque, docker compose usa valores por defecto.

MARKETPLACE_DB_USER=marketplace
MARKETPLACE_DB_PASSWORD=marketplace
MARKETPLACE_DB_NAME=marketplace_db
ADAPTER_API_TOKEN=
