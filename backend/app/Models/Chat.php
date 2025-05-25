<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'tuteur_id',
        'etudiant_id',
        'message',
        'read_at',
        'sender_type'
    ];

    protected $casts = [
        'read_at' => 'datetime'
    ];

    public function tuteur()
    {
        return $this->belongsTo(Tuteur::class, 'tuteur_id');
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id');
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'cours_id');
    }
}