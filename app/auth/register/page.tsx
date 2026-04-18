import { AuthForm } from "../_components/AuthForm";
import { AuthPageLayout } from "../_components/AuthPageLayout";

export default function RegisterPage() {
  return (
    <AuthPageLayout
      title="Crea tu cuenta SmartLogix"
      subtitle="Registro"
      helperText="Registra tu organizacion y comienza a centralizar inventario, pedidos y envios."
    >
      <AuthForm mode="register" />
    </AuthPageLayout>
  );
}
