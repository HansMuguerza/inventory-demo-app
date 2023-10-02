"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useAlertService } from "_services";

import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export { Alert };

function Alert() {
	const pathname = usePathname();
	const alertService = useAlertService();
	const alert = alertService.alert;

	useEffect(() => {
		// clear alert on location change
		alertService.clear();
	}, [pathname]);

	if (!alert) return null;

	return (
		<div className="container">
			<div className="m-3">
				<div
					className={`px-4 py-3 rounded-md flex justify-between ${alert.type}`}
				>
					<div className="flex gap-2 items-center">
						<InformationCircleIcon className="h-5 w-5" />
						<div>{alert.message}</div>
					</div>
					<button
						type="button"
						className="bg-neutral-900/20 p-1 rounded-md"
						onClick={alertService.clear}
					>
						<XMarkIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
