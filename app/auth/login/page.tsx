import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

export default function LoginPage() {
	return (
		<AuthPageLayout
			title="Bienvenido nuevamente"
			subtitle="Acceso"
			helperText="Inicia sesión para operar tu flujo logístico en una sola plataforma."
		>
			<AuthForm mode="login" />
		</AuthPageLayout>
	);
}