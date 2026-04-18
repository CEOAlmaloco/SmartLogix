import { AuthForm } from "../_components/AuthForm";
import { AuthPageLayout } from "../_components/AuthPageLayout";

export default function LoginPage() {
	return (
		<AuthPageLayout
			title="Bienvenido nuevamente"
			subtitle="Acceso"
			helperText="Inicia sesion para operar tu flujo logistica en una sola plataforma."
		>
			<AuthForm mode="login" />
		</AuthPageLayout>
	);
}