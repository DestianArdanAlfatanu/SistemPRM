<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create regular user
        User::create([
            'name' => 'OBL, LEGAL & COMPLIANCE',
            'email' => 'obl@gmail.com',
            'password' => Hash::make('AliSartono'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        
        // Create regular user
        User::create([
            'name' => 'PARTNERSHIP SLA',
            'email' => 'psla@gmail.com',
            'password' => Hash::make('AndangAshari'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create regular user
        User::create([
            'name' => 'PROJECT OPERATION',
            'email' => 'po@gmail.com',
            'password' => Hash::make('PaulusCahyo'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create regular user
        User::create([
            'name' => 'RESOURCE & INVOICING',
            'email' => 'ri@gmail.com',
            'password' => Hash::make('PrasastaArisanti'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        
    }
}
