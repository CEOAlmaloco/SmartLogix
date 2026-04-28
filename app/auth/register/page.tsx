import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

export default function RegisterPage() {
  return (
    <AuthPageLayout
      title="Crea tu cuenta SmartLogix"
      subtitle="Registro"
      helperText="Registra tu organización y comienza a centralizar inventario, pedidos y envíos."
    >
      <AuthForm mode="register" />
    </AuthPageLayout>
  );
}
