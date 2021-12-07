import { applyResolversEnhanceMap } from "prisma/generated/typegraphql";
import { UseMiddleware } from "type-graphql";

// this will fail
applyResolversEnhanceMap({
	User: {
		createUser: [
			UseMiddleware(({ info, context }, next) => {
				console.log("hello, print me");
				// console.log(context);

				return next();
			}),
		],
	},
});
