"use client";

import { useEffect } from "react";
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
} from "_components/ui/select";
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
import { CalendarIcon } from "@heroicons/react/24/solid";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "_components/new-ui/Popover";
import { Calendar } from "_components/ui/calendar";
import { Textarea } from "_components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "_components/new-ui/Command";

export default function EgressForm() {
	const alertService = useAlertService();
	const movementService = useMovementService();

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
			itemId: "",
			type: "Egreso",
			date: new Date(),
			staffId: "",
			userId: user?.id,
			amount: "",
			reason: "",
			obs: "",
		},
	});

	const fields = {
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

			await movementService.create(data);
			message = "Movimiento agregado";

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
		<div>
			<div className="">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="grid grid-cols-1 gap-6">
							<div className="grid grid-cols-2 gap-2">
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
																"w-full justify-between",
																!field.value &&
																	"text-muted-foreground"
															)}
														>
															{field.value
																? newListItems?.find(
																		(
																			item
																		) =>
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
															No hay dato en
															común.
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
																		{
																			item.label
																		}
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
																"w-full justify-between",
																!field.value &&
																	"text-muted-foreground"
															)}
														>
															{field.value
																? newListUsers?.find(
																		(
																			item
																		) =>
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
															No hay dato en
															común.
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
																		{
																			item.label
																		}
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
																"w-full pl-3 text-left font-normal",
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
																	Selecciona
																	una fecha
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
														onSelect={
															field.onChange
														}
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
													<SelectItem value="Instalación">
														Instalación
													</SelectItem>
													<SelectItem value="Avería">
														Avería
													</SelectItem>
													<SelectItem value="Modificación">
														Modificación
													</SelectItem>
													<SelectItem value="Anexo">
														Anexo
													</SelectItem>
													<SelectItem value="Anexo Interno">
														Anexo Interno
													</SelectItem>
													<SelectItem value="Traslado">
														Traslado
													</SelectItem>
													<SelectItem value="Ampliación">
														Ampliación
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
								>
									{form.formState.isSubmitting && (
										<span className="">Guardando...</span>
									)}
									Guardar
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
