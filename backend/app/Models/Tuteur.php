<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Tuteur extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;

    protected $fillable = ['fullname', 'email', 'password', 'specialite_id', 'experience', 'phone', 'status'];

    protected $attributes = [
        'status' => 'en attente'
    ];

}

