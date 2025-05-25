<?php

namespace App\Events;

use App\Models\Chat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chat;

    public function __construct(Chat $chat)
    {
        $this->chat = $chat;
    }

    public function broadcastOn()
    {
        if ($this->chat->sender_type === 'etudiant') {
            return new Channel('chat.' . $this->chat->tuteur_id. '_tuteur');
            
        } else if ($this->chat->sender_type === 'tuteur') {
            return new Channel('chat.'. $this->chat->etudiant_id. '_etudiant');
        }
        // return new Channel('chat.');
    }

    public function broadcastAs()
    {
        return 'new.message';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->chat->id,
            'etudiant_id' => $this->chat->etudiant_id,
            'tuteur_id' => $this->chat->tuteur_id,
            'message' => $this->chat->message,
            'cours_id' => $this->chat->cours_id,
            'created_at' => $this->chat->created_at,
            'read_at' => $this->chat->read_at,
            'sender_type' => $this->chat->sender_type
        ];
    }
}