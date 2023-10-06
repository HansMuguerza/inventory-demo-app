"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useItemService, useMovementService } from "_services";
import { Button, buttonVariants } from "_components/ui/button";
import { DataTableDemo } from "_components/items";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default Items;

function Items() {
	const itemService = useItemService();
	const items = itemService.items;
	const movementService = useMovementService();
	const movements = movementService.movements;

	//convert array of clients - items
	const newListItems = items?.map((item) => {
		const { id, minStock } = item;
		return {
			...item,
			stockTotal: stockTotal(id),
			status: status(id, minStock),
		};
	});

	function status(itemId: any, stockMin: number) {
		const resIng: number | undefined = movements
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.type === "Egreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		if (typeof resIng === "number" && typeof resEgr === "number") {
			const result: number = resIng - resEgr;
			if (result <= 0) {
				return "Sin Stock";
			} else if (result <= stockMin) {
				return "Stock Min";
			} else if (result > stockMin) {
				return "Con Stock";
			}
		} else {
			return "Error";
		}
	}

	function stockTotal(itemId: any) {
		const resIng: number | undefined = movements
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.type === "Egreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		if (typeof resIng === "number" && typeof resEgr === "number") {
			const result: number = resIng - resEgr;

			if (result < 0) {
				return "Stock Error";
			}
			return result;
		} else {
			return "Error";
		}
	}

	useEffect(() => {
		itemService.getAll();
		movementService.getAll();
	}, []);

	return (
		<div className="flex flex-col gap-4">
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
			<div className="w-full">
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead style={{ width: "30%" }}>
									Descripción
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Categoría
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									UM
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Stock Min.
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Destacado
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Stock Actual
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Estado
								</TableHead>
								<TableHead style={{ width: "10%" }}></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableBodyComponent />
						</TableBody>
					</Table>
				</div>
			</div>
			{/* <DataTableDemo /> */}
		</div>
	);

	function TableBodyComponent() {
		if (newListItems?.length) {
			return newListItems.map((item) => (
				<TableRow key={item.id}>
					<TableCell>{item.description}</TableCell>
					<TableCell>{item.category}</TableCell>
					<TableCell>{item.undMed}</TableCell>
					<TableCell>{item.minStock}</TableCell>
					<TableCell>
						{item.important ? "Destacado" : "Comun"}
					</TableCell>
					<TableCell>{item.stockTotal}</TableCell>
					<TableCell>{item.status}</TableCell>
					<TableCell>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">
										Abrir opciones
									</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Opciones</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link
										href={`/inventory/items/edit/${item.id}`}
										className="w-full h-full"
									>
										Editar
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button
										onClick={() =>
											itemService.delete(item.id)
										}
										disabled={item.isDeleting}
										className="w-full h-full flex"
									>
										{item.isDeleting ? (
											<span className="spinner-border spinner-border-sm">
												Eliminando...
											</span>
										) : (
											<span>Eliminar</span>
										)}
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</TableCell>
				</TableRow>
			));
		}

		if (!newListItems) {
			return (
				<tr>
					<td colSpan={4}>
						<Spinner />
					</td>
				</tr>
			);
		}

		if (newListItems?.length === 0) {
			return (
				<TableRow>
					<TableCell className="h-24 text-center">
						Sin Resultados.
					</TableCell>
				</TableRow>
			);
		}
	}
}
