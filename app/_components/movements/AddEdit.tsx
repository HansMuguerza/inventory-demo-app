"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAlertService, useMovementService, useItemService } from "_services";

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

export { AddEdit };

function AddEdit({ title, movement }: { title: string; movement?: any }) {
	const router = useRouter();
	const alertService = useAlertService();
	const movementService = useMovementService();

	const itemService = useItemService();
	const items = itemService.items;

	// get functions to build form with useForm() hook
	const { register, handleSubmit, reset, formState } = useForm({
		defaultValues: movement,
	});
	const { errors } = formState;

	// const fields = {
	// 	itemId: register("itemId", { required: "El item es requerido." }),
	// 	type: register("type", { required: "El tipo es requerido." }),
	// 	date: register("date", { required: "La fecha es requerido." }),
	// 	staffId: register("staffId", { required: "El staff es requerido." }),
	// 	reason: register("reason", { required: "La razón es requerido." }),
	// };

	// async function onSubmit(data: any) {
	// 	alertService.clear();
	// 	try {
	// 		// create or update user based on user prop
	// 		let message;
	// 		if (movement) {
	// 			await movementService.update(movement.id, data);
	// 			message = "Movement updated";
	// 		} else {
	// 			await movementService.create(data);
	// 			console.log(data);
	// 			message = "Movement added";
	// 		}

	// 		// redirect to user list with success message
	// 		router.push("/inventory/items/movements");
	// 		alertService.success(message, true);
	// 	} catch (error: any) {
	// 		alertService.error(error);
	// 	}
	// }

	const FormSchema = z.object({
		itemId: z.string({
			required_error: "Este campo es requerido.",
		}),
		type: z.string({
			required_error: "Este campo es requerido.",
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
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
				message = "Movement updated";
			} else {
				// await movementService.create(data);
				console.log(data);
				message = "Movement added";
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
	}, []);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="grid grid-cols-2 gap-x-6">
						<FormField
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
										El item debe estar agregado en la tabla
										correspondiente.
									</FormDescription>
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
												Ingreso
											</SelectItem>
											<SelectItem value="Egreso">
												Egreso
											</SelectItem>
										</SelectContent>
									</Select>
									{/* <FormDescription>
										
									</FormDescription> */}
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit">Agregar</Button>
				</form>
			</Form>
		</>
	);
}
