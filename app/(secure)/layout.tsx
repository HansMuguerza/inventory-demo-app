import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "_helpers/server";
import { Inter } from "next/font/google";

const roboto = Inter({
	subsets: ["latin"],
	weight: ["100", "300", "400", "700", "900"],
});

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	// if not logged in redirect to login page
	if (!auth.isAuthenticated()) {
		const returnUrl = encodeURIComponent(
			headers().get("x-invoke-path") || "/"
		);
		redirect(`/account/login?returnUrl=${returnUrl}`);
	}

	return (
		<div
			className={roboto.className + "bg-zinc-900 text-zinc-100 h-screen"}
		>
			{children}
		</div>
	);
}
