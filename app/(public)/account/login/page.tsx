"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "_components/ui/button";
import { Input } from "_components/ui/input";

import { useUserService } from "_services";

export default Login;

function Login() {
	const userService = useUserService();

	// get functions to build form with useForm() hook
	const { register, handleSubmit, formState } = useForm();
	const { errors } = formState;

	const fields = {
		username: register("username", { required: "Username is required" }),
		password: register("password", { required: "Password is required" }),
	};

	async function onSubmit({ username, password }: any) {
		await userService.login(username, password);
	}

	return (
		<div className="card">
			<h4 className="card-header">Login</h4>
			<div className="card-body">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-3">
						<label className="form-label">Username</label>
						<Input
							{...fields.username}
							type="text"
							className={`form-control ${
								errors.username ? "is-invalid" : ""
							}`}
						/>
						<div className="invalid-feedback">
							{errors.username?.message?.toString()}
						</div>
					</div>
					<div className="mb-3">
						<label className="form-label">Password</label>
						<Input
							{...fields.password}
							type="password"
							className={`form-control ${
								errors.password ? "is-invalid" : ""
							}`}
						/>
						<div className="invalid-feedback">
							{errors.password?.message?.toString()}
						</div>
					</div>
					<div className="flex gap-x-3">
						<Button disabled={formState.isSubmitting}>
							{formState.isSubmitting && (
								<span className="spinner-border spinner-border-sm me-1"></span>
							)}
							Login
						</Button>
						<Link
							href="/account/register"
							className={buttonVariants({ variant: "outline" })}
						>
							Register
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
