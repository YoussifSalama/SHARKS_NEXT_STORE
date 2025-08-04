import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

/**
 * This is the main router for the EdgeStore buckets.
 */
const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket(),
    category: es.fileBucket()
        .beforeDelete(async ({ ctx, fileInfo }) => {
            // if (ctx.userRole !== 'admin') {
            //     return false;
            // }
            return true;
        }),
    subcategory: es.fileBucket()
        .beforeDelete(async ({ ctx, fileInfo }) => {
            return true;
        }),
    product: es.fileBucket()
        .beforeDelete(async ({ ctx, fileInfo }) => {
            return true;
        })
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;