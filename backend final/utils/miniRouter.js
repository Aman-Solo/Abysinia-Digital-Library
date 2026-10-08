const url = require('url');
const querystring = require('querystring');

class MiniRouter {
    constructor() {
        this.routes = [];
        this.middlewares = [];
    }

    // Helper to add routes
    addRoute(method, path, ...handlers) {
        this.routes.push({
            method: method.toUpperCase(),
            path, // e.g., "/login" or "/:id"
            handlers: handlers.flat()
        });
    }

    get(path, ...handlers) { this.addRoute('GET', path, ...handlers); }
    post(path, ...handlers) { this.addRoute('POST', path, ...handlers); }
    put(path, ...handlers) { this.addRoute('PUT', path, ...handlers); }
    delete(path, ...handlers) { this.addRoute('DELETE', path, ...handlers); }

    use(path, ...handlers) {
        if (typeof path === 'function') {
            // If path is omitted (global middleware)
            this.middlewares.push({ path: '/', handlers: [path, ...handlers] });
        } else {
            this.middlewares.push({ path, handlers: handlers.flat() });
        }
    }

    // Main handler (to be called by the server)
    async handle(req, res, baseUrl = '') {
        // 1. Augment req/res
        this.augmentRequest(req, baseUrl);
        this.augmentResponse(res);

        // 2. Run Global Middlewares matching the baseUrl (mostly likely none for specific routers, but good for completeness)
        // Note: For this localized router replacement, we focus on matching the sub-routes.
        // The server.js will handle global app-level middleware.

        // 3. Match Route
        const method = req.method;
        const relativeUrl = req.url.replace(new RegExp('^' + baseUrl), '') || '/';
        // Remove query string for matching
        const pathOnly = relativeUrl.split('?')[0];

        // Find matcing route
        let matchedRoute = null;
        let params = {};

        for (const route of this.routes) {
            if (route.method !== method) continue;

            const { match, extractedParams } = this.matchPath(route.path, pathOnly);
            if (match) {
                matchedRoute = route;
                params = extractedParams;
                break;
            }
        }

        if (matchedRoute) {
            req.params = params;
            // Execute handlers in sequence
            await this.runHandlers(req, res, matchedRoute.handlers);
        } else {
            // 404 for this router context, but maybe let the parent handle it?
            // For now, if we are in a router handler, we usually send 404 if not found here.
            // But since this is a "use" case, we might need to be careful.
            // For simplicity, if this is used as "app.use('/auth', authRoutes)", we expect it to handle it.
            res.status(404).json({ message: `Cannot ${method} ${req.url}` });
        }
    }

    async runHandlers(req, res, handlers) {
        let index = 0;
        const next = async () => {
            if (index < handlers.length) {
                const handler = handlers[index++];
                try {
                    await handler(req, res, next);
                } catch (err) {
                    console.error("Handler error:", err);
                    if (!res.writableEnded) {
                        res.status(500).json({ message: "Internal Server Error" });
                    }
                }
            }
        };
        await next();
    }

    matchPath(routePath, requestPath) {
        // Convert /users/:id to regex
        // Escape special chars but keep :param
        const paramNames = [];
        const regexPath = routePath.replace(/:([a-zA-Z0-9_]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });

        // Exact match start and end
        const regex = new RegExp(`^${regexPath}$`);
        const match = requestPath.match(regex);

        if (match) {
            const extractedParams = {};
            match.slice(1).forEach((val, i) => {
                extractedParams[paramNames[i]] = decodeURIComponent(val);
            });
            return { match: true, extractedParams };
        }
        return { match: false, extractedParams: {} };
    }

    augmentRequest(req, baseUrl) {
        if (!req.query) {
            const parsedUrl = url.parse(req.url);
            req.query = querystring.parse(parsedUrl.query);
        }
        // req.body should be parsed by server.js before calling this
        if (!req.body) req.body = {};
    }

    augmentResponse(res) {
        if (res.status) return; // Already augmented

        res.status = (code) => {
            res.statusCode = code;
            return res;
        };

        res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
        };

        res.send = (data) => {
            res.end(data);
            return res;
        };
    }
}

module.exports = MiniRouter;
