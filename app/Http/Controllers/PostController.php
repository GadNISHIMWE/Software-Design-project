<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
{
    return response()->json(Post::all()); // Temporarily return JSON
}

    public function create()
    {
        return view('posts.create');
    }

    public function store(Request $request)
    {
        Post::create($request->validate([
            'title' => 'required',
            'content' => 'required'
        ]));
        return redirect()->route('posts.index');
    }

    
    // Add other resource methods (show, edit, update, destroy) as needed
}