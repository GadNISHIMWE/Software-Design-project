<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the middleware for the application.
     *
     * @return void
     */
    protected function configureMiddleware()
    {
        $this->app->router->middlewareGroups([
            'api' => [
                EnsureFrontendRequestsAreStateful::class,
                'throttle:api',
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ],
            'web' => [
                \Illuminate\Cookie\Middleware\EncryptCookies::class,
                \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
                \Illuminate\Session\Middleware\StartSession::class,
                \Illuminate\Session\Middleware\AuthenticateSession::class,
                \Illuminate\View\Middleware\ShareErrorsFromSession::class,
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ],
        ]);
    }

    /**
     * Configure the application's middleware stack.
     *
     * @param  \Illuminate\Foundation\Http\Kernel  $kernel
     * @return void
     */
    protected function configureMiddlewareStack(\Illuminate\Foundation\Http\Kernel $kernel)
    {
        $kernel->appendToMiddlewareGroup('api', 'auth:sanctum');
    }
} 