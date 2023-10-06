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
} from "_components/ui/select";
import { Button } from "_components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
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
} from "_components/ui/popover";
import { Calendar } from "_components/ui/calendar";
import { Textarea } from "_components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "_components/ui/command";

export { AddEdit };

function AddEdit({ title, movement }: { title: string; movement?: any }) {
	const router = useRouter();
	const alertService = useAlertService();
	const movementService = useMovementService();

	const itemService = useItemService();
	const items = itemService.items;

	const userService = useUserService();
	const users = userService.users;

	//convert array of clients - items
	const newListItems = items?.map((item) => {
		const { id, description } = item;
		return {
			value: id,
			label: description,
		};
	});

	const form = useForm({
		defaultValues: {
			itemId: movement?.itemId || "",
			type: movement?.type || "",
			date:
				movement &&
				movement.date &&
				new Date(movement.date) instanceof Date
					? new Date(movement.date)
					: new Date(),
			staffId: movement?.staffId || "",
			amount: movement?.amount || "",
			reason: movement?.reason || "",
			obs: movement?.obs || "",
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
			title: "Data:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(data, null, 2)}
					</code>
				</pre>
			),
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
			router.push("/inventory/items/movements");
			alertService.success(message, true);
		} catch (error: any) {
			alertService.error(error);
		}
	}

	useEffect(() => {
		itemService.getAll();
		userService.getAll();
	}, []);

	return (
		<div className="flex justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-[750px]"
				>
					<div className="grid grid-cols-1 gap-6">
						<Title>{title}</Title>
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
																		language
																	) =>
																		language.value ===
																		field.value
															  )?.label
															: "Selecciona el item"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0">
												<Command>
													<CommandInput placeholder="Busca el item..." />
													<CommandEmpty>
														No hay dato en común.
													</CommandEmpty>
													<CommandGroup>
														{newListItems?.map(
															(language) => (
																<CommandItem
																	value={
																		language.label
																	}
																	key={
																		language.value
																	}
																	onSelect={() => {
																		form.setValue(
																			"itemId",
																			language.value
																		);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			language.value ===
																				field.value
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	{
																		language.label
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
							{/* <FormField
								control={form.control}
								name="itemId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Item</FormLabel>
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
												{items &&
													items.map((item) => (
														<SelectItem
															key={item.id}
															value={item.id}
														>
															{item.description}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormDescription>
											El item debe estar agregado en la
											tabla correspondiente.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/> */}

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
													Ingreso
												</SelectItem>
												<SelectItem value="Egreso">
													Egreso
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
									<FormItem>
										<FormLabel>Personal</FormLabel>
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
												{users &&
													users.map((item) => (
														<SelectItem
															key={item.id}
															value={item.id}
														>
															{`${item.firstName} ${item.lastName}`}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
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
												<SelectItem value="Inicial">
													Inicial
												</SelectItem>
												<SelectItem value="Instalación">
													Instalación
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
						<Button
							variant="ghost"
							onClick={() => form.reset()}
							disabled={form.formState.isSubmitting}
						>
							Restaurar
						</Button>
						<Button variant="ghost">
							<Link href="/inventory/items/movements">
								Cancelar
							</Link>
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
