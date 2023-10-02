"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useItemService } from "_services";
import { buttonVariants } from "_components/ui/button";

export default Items;

function Items() {
	const itemService = useItemService();
	const items = itemService.items;

	useEffect(() => {
		itemService.getAll();
	}, []);

	return (
		<>
			<Title>Items</Title>
			<div className="flex gap-x-2">
				<Link
					href="/inventory/items/add"
					className={buttonVariants({ variant: "outline" })}
				>
					Agregar Item
				</Link>
				<Link
					href="/inventory/items/movements"
					className={buttonVariants({ variant: "outline" })}
				>
					Movimientos
				</Link>
			</div>
			<div>
				<table className="table table-striped">
					<thead>
						<tr>
							<th style={{ width: "30%" }}>Descripción</th>
							<th style={{ width: "30%" }}>Categoría</th>
							<th style={{ width: "30%" }}>Modelo</th>
							<th style={{ width: "30%" }}>Marca</th>
							<th style={{ width: "30%" }}>UM</th>
							<th style={{ width: "30%" }}>Stock Min.</th>
							<th style={{ width: "30%" }}>Destacado</th>
							<th style={{ width: "10%" }}></th>
						</tr>
					</thead>
					<tbody>
						<TableBody />
					</tbody>
				</table>
			</div>
		</>
	);

	function TableBody() {
		if (items?.length) {
			return items.map((item) => (
				<tr key={item.id}>
					<td>{item.description}</td>
					<td>{item.category}</td>
					<td>{item.model}</td>
					<td>{item.brand}</td>
					<td>{item.undMed}</td>
					<td>{item.minStock}</td>
					<td>{item.important}</td>
					<td>{item.state}</td>
					<td style={{ whiteSpace: "nowrap" }}>
						<Link
							href={`/inventory/items/edit/${item.id}`}
							className="btn btn-sm btn-primary me-1"
						>
							Editar
						</Link>
						<button
							onClick={() => itemService.delete(item.id)}
							className="btn btn-sm btn-danger btn-delete-user"
							style={{ width: "60px" }}
							disabled={item.isDeleting}
						>
							{item.isDeleting ? (
								<span className="spinner-border spinner-border-sm">
									Eliminando...
								</span>
							) : (
								<span>Eliminar</span>
							)}
						</button>
					</td>
				</tr>
			));
		}

		if (!items) {
			return (
				<tr>
					<td colSpan={4}>
						<Spinner />
					</td>
				</tr>
			);
		}

		if (items?.length === 0) {
			return (
				<tr>
					<td colSpan={4} className="text-center">
						<div className="p-2">No hay items para mostrar.</div>
					</td>
				</tr>
			);
		}
	}
}
