"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useMovementService } from "_services";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";
import { Button, buttonVariants } from "_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default Movements;

function Movements() {
	const movementService = useMovementService();
	const movements = movementService.movements;

	useEffect(() => {
		movementService.getAll();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<Title>Movimientos</Title>
			<div>
				<Link
					href="/inventory/items/movements/add"
					className={buttonVariants({ variant: "outline" })}
				>
					Agregar Movimiento
				</Link>
			</div>

			<div className="w-full">
				<div className="rounded-md border">
					<Table className="table table-striped">
						<TableHeader>
							<TableRow>
								<TableHead style={{ width: "10%" }}>
									Tipo
								</TableHead>
								<TableHead style={{ width: "20%" }}>
									Fecha
								</TableHead>
								<TableHead style={{ width: "10%" }}>
									Cantidad
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Item
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Razón
								</TableHead>
								<TableHead style={{ width: "20%" }}>
									Personal
								</TableHead>
								<TableHead style={{ width: "30%" }}>
									Obs
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
		</div>
	);

	function TableBodyComponent() {
		if (movements?.length) {
			return movements.map((movement) => (
				<TableRow key={movement._id}>
					<TableCell>{movement.type}</TableCell>
					<TableCell>
						{movement.date &&
							new Date(movement.date).toLocaleDateString(
								"es-PE",
								{
									timeZone: "UTC",
									year: "numeric",
									month: "numeric",
									day: "numeric",
								}
							)}
					</TableCell>
					<TableCell>{movement.amount}</TableCell>
					<TableCell>{movement.Item.description}</TableCell>
					<TableCell>{movement.reason}</TableCell>
					<TableCell>{movement.User.firstName}</TableCell>
					<TableCell>{movement.obs}</TableCell>
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
										href={`/inventory/items/movements/edit/${movement._id}`}
										className="w-full h-full"
									>
										Editar
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button
										onClick={() =>
											movementService.delete(movement._id)
										}
										disabled={movement.isDeleting}
										className="w-full h-full flex"
									>
										{movement.isDeleting ? (
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

		if (!movements) {
			return (
				<tr>
					<td colSpan={4}>
						<Spinner />
					</td>
				</tr>
			);
		}

		if (movements?.length === 0) {
			return (
				<TableRow>
					<TableCell colSpan={4} className="text-center">
						<div className="p-2">No hay registros para mostrar</div>
					</TableCell>
				</TableRow>
			);
		}
	}
}
