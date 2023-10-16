"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEdit } from "_components/movements";
import { Spinner } from "_components";
import { useMovementService } from "_services";

export default Edit;

function Edit({ params: { id } }: any) {
	const router = useRouter();
	const movementService = useMovementService();
	const movement = movementService.movement;

	useEffect(() => {
		if (!id) return;

		// fetch user for add/edit form
		movementService.getById(id);
	}, [router]);

	return movement ? (
		<AddEdit title="Editar Movimiento" movement={movement} />
	) : (
		<Spinner />
	);
}
