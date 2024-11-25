"use client";

import * as React from "react";
import {
	ArrowUpDown,
	ChevronDown,
	MoreHorizontal,
	Star,
	StarOff,
} from "lucide-react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "_components/ui/button";
import { Checkbox } from "_components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/new-ui/Table";
import { IItem } from "_services";
import { Badge } from "_components/ui/badge";
import { Input } from "_components/new-ui/Input";
import Link from "next/link";

export const columns: ColumnDef<IItem>[] = [
	{
		accessorKey: "description",
		header: "Descripción",
		cell: ({ row }) => <div>{row.getValue("description")}</div>,
	},
	{
		accessorKey: "category",
		header: ({ column }) => {
			return (
				<button
					className="flex items-center gap-0.5 py-2"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Categoría
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		accessorKey: "undMed",
		header: "UM",
		cell: ({ row }) => <div>{row.getValue("undMed")}</div>,
	},
	{
		accessorKey: "minStock",
		header: "Stock Min.",
		cell: ({ row }) => <div>{row.getValue("minStock")}</div>,
	},
	{
		accessorKey: "important",
		header: "Destacado",
		cell: ({ row }) => (
			<div>
				{row.getValue("important") ? (
					<Star className="h-4 w-4 text-yellow-400" />
				) : (
					<StarOff className="h-4 w-4 text-neutral-600" />
				)}
			</div>
		),
	},
	{
		accessorKey: "stockTotal",
		header: "Stock Actual",
		cell: ({ row }) => <div>{row.getValue("stockTotal")}</div>,
	},
	{
		accessorKey: "status",
		header: "Estado",
		cell: ({ row }) => <div>{row.getValue("status")}</div>,
	},
	// {
	// 	id: "actions",
	// 	enableHiding: false,
	// },
];

interface children {
	data: Array<IItem> | undefined;
	itemService: any;
	role?: string;
}

export { DataTableDemo };

function DataTableDemo({ data, itemService }: children) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	if (data === undefined) {
		data = [];
	}

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full flex flex-col gap-3">
			<Input
				placeholder="Filtrar descripción..."
				value={
					(table
						.getColumn("description")
						?.getFilterValue() as string) ?? ""
				}
				onChange={(event) =>
					table
						.getColumn("description")
						?.setFilterValue(event.target.value)
				}
				className="max-w-sm"
			/>
			<div className="rounded-md border border-zinc-500">
				<Table>
					<TableHeader className="text-zinc-400">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-zinc-500"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="font-semibold border-zinc-500 text-zinc-700"
								>
									<TableCell>
										{row.original.description}
									</TableCell>
									<TableCell>
										{row.original.category}
									</TableCell>
									<TableCell>{row.original.undMed}</TableCell>
									<TableCell>
										{row.original.minStock}
									</TableCell>

									<TableCell>
										{row.getValue("important") ? (
											<Star className="h-4 w-4 text-yellow-400" />
										) : (
											<StarOff className="h-4 w-4 text-neutral-600" />
										)}
									</TableCell>
									<TableCell>
										{row.original.stockTotal}
									</TableCell>
									<TableCell>
										{row.original.status === "Con Stock" ? (
											<Badge
												variant="success"
												className="text-white"
											>
												Con Stock
											</Badge>
										) : null}
										{row.original.status === "Stock Min" ? (
											<Badge
												variant="warning"
												className="text-white"
											>
												Stock Min
											</Badge>
										) : null}
										{row.original.status === "Sin Stock" ? (
											<Badge
												variant="error"
												className="text-white"
											>
												Sin Stock
											</Badge>
										) : null}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
												>
													<span className="sr-only">
														Abrir opciones
													</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>
													Opciones
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem>
													<Link
														href={`/inventory/items/edit/${row.original.id}`}
														className="w-full h-full"
													>
														Editar
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<button
														onClick={() =>
															window.confirm(
																"¿Seguro que deseas eliminar el registro?"
															)
																? itemService.delete(
																		row
																			.original
																			.id
																  )
																: null
														}
														disabled={
															row.original
																.isDeleting
														}
														className="w-full h-full flex"
													>
														{row.original
															.isDeleting ? (
															<span className="spinner-border spinner-border-sm">
																Eliminando...
															</span>
														) : (
															<span>
																Eliminar
															</span>
														)}
													</button>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Sin resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} de{" "}
					{table.getFilteredRowModel().rows.length} fila(s)
					seleccionada.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Siguiente
					</Button>
				</div>
			</div>
		</div>
	);
}
