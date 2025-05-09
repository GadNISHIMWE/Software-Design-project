<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id(); // Auto-incrementing primary key
        $table->string('title'); // VARCHAR column
        $table->text('content'); // TEXT column
        $table->timestamps(); // created_at + updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
