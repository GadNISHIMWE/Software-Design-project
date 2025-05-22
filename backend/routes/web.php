<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () { 
    return view('welcome');
});
use App\Models\Post;

Route::get('/posts', function () {
    return Post::all(); // Returns all posts as JSON
});

use App\Http\Controllers\PostController;
Route::resource('posts', PostController::class);