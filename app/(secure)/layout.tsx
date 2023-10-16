import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "_helpers/server";
import { Alert, Nav } from "_components";
import { Toaster } from "_components/ui/toaster";
import { useUserService } from "_services";

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
	// if not logged in redirect to login page
	if (!auth.isAuthenticated()) {
		const returnUrl = encodeURIComponent(
			headers().get("x-invoke-path") || "/"
		);
		redirect(`/account/login?returnUrl=${returnUrl}`);
	}

	return (
		<div className="app-container bg-light">
			<Nav />
			<Alert />
			<div className="relative top-[70px] z-10">
				<div className="py-3 px-4">{children}</div>
				<Toaster />
			</div>
		</div>
	);
}
