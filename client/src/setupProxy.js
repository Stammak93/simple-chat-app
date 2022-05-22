if(process.env.NODE_ENV !== "production") {

    const { createProxyMiddleware } = require("http-proxy-middleware");

    module.exports = (app) => {
        app.use(
            ["/api/*", "/auth/google"],
            createProxyMiddleware({
                target: "http://localhost:5000"
            })
        )
    }


}