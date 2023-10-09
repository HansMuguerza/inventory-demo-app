"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useMovementService, useUserService } from "_services";
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
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { toast } from "_components/ui/use-toast";
import { Badge } from "_components/ui/badge";

export default Movements;

function Movements() {
	const userService = useUserService();
	const user = userService.currentUser;
	const movementService = useMovementService();
	const movements = movementService.movements;

	useEffect(() => {
		userService.getCurrent();
		movementService.getAll();
	}, []);

	if (user?.role === "SUPERADMIN") {
		return (
			<div className="flex flex-col gap-4">
				<Title>Movimientos</Title>
				<div>
					<Link
						href="/inventory/movements/add"
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
									<TableHead>Tipo</TableHead>
									<TableHead>Fecha</TableHead>
									<TableHead>Cantidad</TableHead>
									<TableHead>Item</TableHead>
									<TableHead>Razón</TableHead>
									<TableHead>Personal</TableHead>
									<TableHead>Obs</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableBodyComponentSuperadmin />
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		);
	}

	if (user?.role === "ADMIN") {
		return (
			<div className="flex flex-col gap-4">
				<Title>Movimientos</Title>
				<div>
					<Link
						href="/inventory/movements/add"
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
									<TableHead>Tipo</TableHead>
									<TableHead>Fecha</TableHead>
									<TableHead>Cantidad</TableHead>
									<TableHead>Item</TableHead>
									<TableHead>Razón</TableHead>
									<TableHead>Personal</TableHead>
									<TableHead>Obs</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableBodyComponentAdmin />
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Spinner />
		</div>
	);

	function TableBodyComponentSuperadmin() {
		if (movements?.length) {
			return movements.map((movement) => (
				<TableRow key={movement._id}>
					<TableCell>
						{movement.type === "Ingreso" ? (
							<div>
								<Badge variant="success">
									<div className="flex items-center gap-1">
										<ArrowUp className="h-3 w-3" />
										Ingreso
									</div>
								</Badge>
							</div>
						) : null}
						{movement.type === "Egreso" ? (
							<div>
								<Badge variant="error">
									<div className="flex items-center gap-1">
										<ArrowDown className="h-3 w-3" />
										Egreso
									</div>
								</Badge>
							</div>
						) : null}
					</TableCell>
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
					<TableCell>{movement.Item?.description}</TableCell>
					<TableCell>{movement.reason}</TableCell>
					<TableCell>
						{movement.User?.firstName.split(" ")[0]}
					</TableCell>
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
										href={`/inventory/movements/edit/${movement._id}`}
										className="w-full h-full"
									>
										Editar
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button
										onClick={() => {
											try {
												movementService.delete(
													movement._id
												);
											} catch (error) {
												console.log(error);
											} finally {
												toast({
													title: "Notificación",
													description: (
														<div>
															¡Registro Eliminado!
														</div>
													),
												});
											}
										}}
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

	function TableBodyComponentAdmin() {
		if (movements?.length) {
			return movements.map((movement) => (
				<TableRow key={movement._id}>
					<TableCell>
						{movement.type === "Ingreso" ? (
							<div>
								<Badge variant="success">
									<div className="flex items-center gap-1">
										<ArrowUp className="h-3 w-3" />
										Ingreso
									</div>
								</Badge>
							</div>
						) : null}
						{movement.type === "Egreso" ? (
							<div>
								<Badge variant="error">
									<div className="flex items-center gap-1">
										<ArrowDown className="h-3 w-3" />
										Egreso
									</div>
								</Badge>
							</div>
						) : null}
					</TableCell>
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
					<TableCell>{movement.Item?.description}</TableCell>
					<TableCell>{movement.reason}</TableCell>
					<TableCell>
						{movement.User?.firstName.split(" ")[0]}
					</TableCell>
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
										href={`/inventory/movements/edit/${movement._id}`}
										className="w-full h-full"
									>
										Editar
									</Link>
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
