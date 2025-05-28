<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('species');
            $table->date('planting_date');
            $table->date('harvest_date')->nullable();
            $table->enum('status', ['growing', 'harvested', 'failed'])->default('growing');
            $table->foreignId('greenhouse_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('plants');
    }
}; 