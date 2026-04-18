import { AuthForm } from "../_components/AuthForm";
import { AuthPageLayout } from "../_components/AuthPageLayout";

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
