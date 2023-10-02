import mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

export const db = {
	User: userModel(),
	Item: itemModel(),
	Movement: movementModel(),
};

// mongoose models with schema definitions

function userModel() {
	const schema = new Schema(
		{
			username: { type: String, unique: true, required: true },
			hash: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			role: { type: String, required: true },
		},
		{
			// add createdAt and updatedAt timestamps
			timestamps: true,
		}
	);

	schema.set("toJSON", {
		virtuals: true,
		versionKey: false,
		transform: function (doc, ret) {
			delete ret._id;
			delete ret.hash;
		},
	});

	return mongoose.models.User || mongoose.model("User", schema);
}

function itemModel() {
	const schema = new Schema(
		{
			description: { type: String, required: true },
			category: { type: String, required: true },
			model: { type: String },
			brand: { type: String },
			undMed: { type: String, required: true },
			minStock: { type: Number, required: true },
			important: { type: Boolean, default: false },
			state: { type: String },
			deletedAt: { type: Date, default: null },
		},
		{
			// add createdAt and updatedAt timestamps
			timestamps: true,
		}
	);

	schema.set("toJSON", {
		virtuals: true,
		versionKey: false,
		transform: function (doc, ret) {
			delete ret._id;
		},
	});

	return mongoose.models.Item || mongoose.model("Item", schema);
}

function movementModel() {
	const schema = new Schema(
		{
			type: { type: String, required: true },
			date: { type: Date, default: Date.now() },
			itemId: {
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true,
			},
			staffId: {
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			amount: { type: Number, required: true },
			reason: { type: String, required: true },
			obs: { type: String },
			deletedAt: { type: Date, default: null },
		},
		{
			// add createdAt and updatedAt timestamps
			timestamps: true,
		}
	);

	schema.set("toJSON", {
		virtuals: true,
		versionKey: false,
		transform: function (doc, ret) {
			delete ret._id;
		},
	});

	return mongoose.models.Movement || mongoose.model("Movement", schema);
}
