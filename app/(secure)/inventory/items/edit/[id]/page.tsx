"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEdit } from "_components/items";
import { Spinner } from "_components";
import { useItemService } from "_services";

export default Edit;

function Edit({ params: { id } }: any) {
	const router = useRouter();
	const itemService = useItemService();
	const item = itemService.item;

	useEffect(() => {
		if (!id) return;

		// fetch user for add/edit form
		itemService.getById(id);
	}, [router]);

	return item ? <AddEdit title="Editar Item" item={item} /> : <Spinner />;
}
