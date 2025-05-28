<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('greenhouses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->decimal('size', 10, 2);
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('greenhouses');
    }
}; 