<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('greenhouses', function (Blueprint $table) {
            $table->float('temperature')->nullable()->after('status');
            $table->float('humidity')->nullable()->after('temperature');
            $table->float('soil_moisture')->nullable()->after('humidity');
            $table->float('light_intensity')->nullable()->after('soil_moisture');
        });
    }

    public function down()
    {
        Schema::table('greenhouses', function (Blueprint $table) {
            $table->dropColumn(['temperature', 'humidity', 'soil_moisture', 'light_intensity']);
        });
    }
}; 