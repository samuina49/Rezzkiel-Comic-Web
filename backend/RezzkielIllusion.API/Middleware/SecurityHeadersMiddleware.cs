namespace RezzkielIllusion.API.Middleware;

public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Prevent Clickjacking
        context.Response.Headers.Append("X-Frame-Options", "DENY");
        
        // Prevent MIME-sniffing
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        
        // Control referrer info
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Basic Content Security Policy
        // Note: In a real production app, this would be much more detailed.
        context.Response.Headers.Append("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' http://localhost:5042;");

        // HSTS (Strict Transport Security) - only if HTTPS
        if (context.Request.IsHttps)
        {
            context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }

        await _next(context);
    }
}
