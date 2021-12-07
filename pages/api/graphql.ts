import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { GraphQLSchema } from "graphql";
import { NextApiRequest, PageConfig } from "next";
import {
	applyResolversEnhanceMap,
	resolvers,
} from "prisma/generated/typegraphql";
import { buildSchema, UseMiddleware } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// apply on api file will work and apply on separate file will not work

// applyResolversEnhanceMap({
// 	User: {
// 		createUser: [
// 			UseMiddleware(({ info, context }, next) => {
// 				console.log("hello, print me");
// 				// console.log(context);

// 				return next();
// 			}),
// 		],
// 	},
// });

// Prisma things

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

// Apollo things

let server: ApolloServer;

async function getApolloServer(schema: GraphQLSchema, request: NextApiRequest) {
	if (!server) {
		server = new ApolloServer({
			schema,
			context: () => ({ prisma, request }),
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
		});
		await server.start();
		return server;
	} else {
		return server;
	}
}

const handler = async (req, res) => {
	const schema = await buildSchema({
		resolvers,
		validate: true,
	});

	const apolloServer = await getApolloServer(schema, req);
	await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
};

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};

export default handler;
