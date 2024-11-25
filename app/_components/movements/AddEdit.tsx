"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "_helpers/client/shadcn";
import {
	useAlertService,
	useMovementService,
	useItemService,
	useUserService,
} from "_services";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "_components/new-ui/Select";
import { Button } from "_components/new-ui/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "_components/ui/form";
import { toast } from "_components/ui/use-toast";
import { Input } from "_components/ui/input";
import Link from "next/link";
import { Title } from "_components";
import { CalendarIcon } from "@heroicons/react/24/solid";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "_components/new-ui/Popover";
import { Calendar } from "_components/new-ui/Calendar";
import { Textarea } from "_components/new-ui/Textarea";
import { ArrowDown, ArrowUp, Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "_components/new-ui/Command";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";
import { Badge } from "_components/ui/badge";

export { AddEdit };

function AddEdit({ title, movement }: { title: string; movement?: any }) {
	const router = useRouter();
	const alertService = useAlertService();
	const movementService = useMovementService();
	const movements = movementService.movements;

	const itemService = useItemService();
	const items = itemService.items;

	const userService = useUserService();
	const users = userService.users;
	const user = userService.currentUser;

	//convert array of clients - items
	const newListItems = items
		?.filter((obj) => obj.category !== "EQUIPO MSM")
		.map((item) => {
			const { id, description } = item;
			return {
				value: id,
				label: description,
			};
		});

	//convert array of clients - users
	const newListUsers = users?.map((item) => {
		const { id, firstName, lastName } = item;
		return {
			value: id,
			label: firstName + " " + lastName,
		};
	});

	const form = useForm({
		defaultValues: {
			district: movement?.district || "",
			itemId: movement?.itemId || "",
			type: movement?.type || "",
			date:
				movement &&
				movement.date &&
				new Date(movement.date) instanceof Date
					? new Date(movement.date)
					: new Date(),
			staffId: movement?.staffId || "",
			userId: user?.id,
			amount: movement?.amount || "",
			reason: movement?.reason || "",
			obs: movement?.obs || "",
		},
	});

	const fields = {
		district: form.register("district"),
		itemId: form.register("itemId", { required: "El item es requerido." }),
		type: form.register("type", { required: "El tipo es requerido." }),
		date: form.register("date", { required: "La fecha es requerido." }),
		staffId: form.register("staffId", {
			required: "El staff es requerido.",
		}),
		amount: form.register("amount", { required: "La razón es requerido." }),
		reason: form.register("reason", { required: "La razón es requerido." }),
		obs: form.register("obs"),
	};

	async function onSubmit(data: any) {
		toast({
			title: "Notificación",
			description: <div>¡Registro Guardado!</div>,
		});

		alertService.clear();
		try {
			// create or update user based on user prop
			let message;
			if (movement) {
				await movementService.update(movement.id, data);
				message = "Movimiento actualizado";
			} else {
				await movementService.create(data);
				message = "Movimiento agregado";
			}

			// redirect to user list with success message
			// router.push("/inventory/movements");
			movementService.getAll();
			// alertService.success(message, true);
		} catch (error: any) {
			alertService.error(error);
		}
	}

	useEffect(() => {
		userService.getCurrent();
		itemService.getAll();
		userService.getAll();
		movementService.getAll();
	}, []);

	return (
		<div className="flex justify-center gap-x-5">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-[750px]"
				>
					<div className="grid grid-cols-1 gap-6">
						<Title>{title}</Title>
						<div className="grid grid-cols-2 gap-2">
							{/* <>
								{user?.role === "SUPERADMIN" ? (
									<FormField
										control={form.control}
										name="district"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Distrito</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Selecciona una opción" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="SAN RAMÓN">
															SAN RAMÓN
														</SelectItem>
														<SelectItem value="PERENÉ">
															PERENÉ
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								) : null}
							</> */}
							<FormField
								control={form.control}
								name="itemId"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Item</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between rounded-md border-neutral-400",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value
															? newListItems?.find(
																	(item) =>
																		item.value ===
																		field.value
															  )?.label
															: "Selecciona el item"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="Busca el item..." />
													<CommandEmpty>
														No hay dato en común.
													</CommandEmpty>
													<CommandGroup>
														{newListItems?.map(
															(item) => (
																<CommandItem
																	value={
																		item.label
																	}
																	key={
																		item.value
																	}
																	onSelect={() => {
																		form.setValue(
																			"itemId",
																			item.value
																		);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			item.value ===
																				field.value
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	{item.label}
																</CommandItem>
															)
														)}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecciona una opción" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Ingreso">
													<div className="flex items-center gap-2 text-green-700">
														<ArrowUp className="h-3 w-3" />
														<span>Ingreso</span>
													</div>
												</SelectItem>
												<SelectItem value="Egreso">
													<div className="flex items-center gap-2 text-red-700">
														<ArrowDown className="h-3 w-3" />
														<span>Egreso</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="staffId"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Personal</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between rounded-md border-neutral-400",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value
															? newListUsers?.find(
																	(item) =>
																		item.value ===
																		field.value
															  )?.label
															: "Selecciona el personal"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="Busca el item..." />
													<CommandEmpty>
														No hay dato en común.
													</CommandEmpty>
													<CommandGroup>
														{newListUsers?.map(
															(item) => (
																<CommandItem
																	value={
																		item.label
																	}
																	key={
																		item.value
																	}
																	onSelect={() => {
																		form.setValue(
																			"staffId",
																			item.value
																		);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			item.value ===
																				field.value
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	{item.label}
																</CommandItem>
															)
														)}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={() => (
									<FormItem>
										<FormLabel>Cantidad</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="10"
												{...fields.amount}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Fecha de Movimiento
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal rounded-md border-neutral-400",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value ? (
															format(
																field.value as any,
																"PPP",
																{
																	locale: es,
																}
															)
														) : (
															<span>
																Selecciona una
																fecha
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date: any) =>
														date > new Date() ||
														date <
															new Date(
																"1900-01-01"
															)
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="reason"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Razón de Movimiento
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecciona una opción" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Venta">
													Venta
												</SelectItem>
												<SelectItem value="Proveedor">
													Proveedor
												</SelectItem>
												<SelectItem value="Envío">
													Envío
												</SelectItem>
												<SelectItem value="Inicial">
													Inicial
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="obs"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Observaciones</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Alguna observación extra."
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex gap-x-2">
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="bg-green-600 hover:bg-green-800"
							>
								{form.formState.isSubmitting && (
									<span className="">Guardando...</span>
								)}
								Guardar
							</Button>
							<Button variant="ghost" className="bg-red-600">
								<Link href="/inventory/movements">
									Cancelar
								</Link>
							</Button>
						</div>
					</div>
				</form>
			</Form>
			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tipo</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Cantidad</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{movements
							?.filter((i: any) => i.district !== "PERENÉ")
							.slice(0, 10)
							.map((obj) => (
								<TableRow key={obj._id}>
									<TableCell>
										{obj.type === "Ingreso" ? (
											<div>
												<Badge variant="success">
													<div className="flex items-center gap-1">
														<ArrowUp className="h-3 w-3" />
													</div>
												</Badge>
											</div>
										) : null}
										{obj.type === "Egreso" ? (
											<div>
												<Badge variant="error">
													<div className="flex items-center gap-1">
														<ArrowDown className="h-3 w-3" />
													</div>
												</Badge>
											</div>
										) : null}
									</TableCell>
									<TableCell>
										{obj.Item.description}
									</TableCell>
									<TableCell>{obj.amount}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
