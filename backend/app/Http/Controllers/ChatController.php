<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Events\ChatEvent;
use App\Models\CoursSubscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function sendMessageToTuteur(Request $request)
    {
        $request->validate([
            'tuteur_id' => 'required|exists:tuteurs,id',
            'message' => 'required|string',
        ]);

        // Verify that the student is connected to the tutor through any course subscription
        $subscription = CoursSubscriptions::where('etudiant_id', Auth::id())
            ->where('tuteur_id', $request->tuteur_id)
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'You can only chat with tutors you are subscribed to through a course'
            ], 403);
        }

        $chat = Chat::create([
            'etudiant_id' => Auth::id(),
            'tuteur_id' => $request->tuteur_id,
            'message' => $request->message,
            // 'cours_id' => $subscription->cours_id, // Use the first available course subscription
            'sender_type' => 'etudiant'
        ]);

        // Broadcast the chat event
        broadcast(new ChatEvent($chat));

        return response()->json([
            'success' => true,
            'message' => 'Message sent to tutor successfully',
            'data' => $chat
        ]);
    }

    public function sendMessageToEtudiant(Request $request)
    {
        $request->validate([
            'etudiant_id' => 'required|exists:etudiants,id',
            'message' => 'required|string'
        ]);

        // Verify that the tutor is connected to the student through any course subscription
        $subscription = CoursSubscriptions::where('tuteur_id', Auth::id())
            ->where('etudiant_id', $request->etudiant_id)
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'You can only chat with students enrolled in your courses'
            ], 403);
        }

        $chat = Chat::create([
            'tuteur_id' => Auth::id(),
            'etudiant_id' => $request->etudiant_id,
            'message' => $request->message,
            // 'cours_id' => $subscription->cours_id, // Use the first available course subscription
            'sender_type' => 'tuteur'
        ]);

        // Broadcast the chat event
        broadcast(new ChatEvent($chat));

        return response()->json([
            'success' => true,
            'message' => 'Message sent to student successfully',
            'data' => $chat
        ]);
    }

    public function getStudentMessages(Request $request, $tutor_id)
    {
        // Verify that the student is connected to the tutor through any course subscription
        $subscription = CoursSubscriptions::where('etudiant_id', Auth::id())
            ->where('tuteur_id', $tutor_id)
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'You can only view messages with tutors you are subscribed to'
            ], 403);
        }

        $messages = Chat::where(function($query) use ($tutor_id) {
                $query->where(function($q) use ($tutor_id) {
                    $q->where('etudiant_id', Auth::id())
                      ->where('tuteur_id', $tutor_id);
                })->orWhere(function($q) use ($tutor_id) {
                    $q->where('etudiant_id', $tutor_id)
                      ->where('tuteur_id', Auth::id());
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function getTutorMessages(Request $request, $student_id)
    {
        // Verify that the tutor is connected to the student through course subscriptions
        $subscription = CoursSubscriptions::where('tuteur_id', Auth::id())
            ->where('etudiant_id', $student_id)
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'You can only view messages with students enrolled in your courses'
            ], 403);
        }

        $messages = Chat::where(function($query) use ($student_id) {
                $query->where(function($q) use ($student_id) {
                    $q->where('tuteur_id', Auth::id())
                      ->where('etudiant_id', $student_id);
                })->orWhere(function($q) use ($student_id) {
                    $q->where('tuteur_id', $student_id)
                      ->where('etudiant_id', Auth::id());
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'message_id' => 'required|exists:chats,id'
        ]);

        $message = Chat::findOrFail($request->message_id);
        
        if ($message->sender_type === 'tuteur') {
            if ($message->tuteur_id !== Auth::id()) {
                return response()->json([
                   'success' => false,
                   'message' => 'You are not authorized to mark this message as read'
                ], 403);
            }
            $message->update(['read_at' => now()]);
        } else if ($message->sender_type === 'etudiant') {
            if ($message->etudiant_id!== Auth::id()) {
                return response()->json([
                  'success' => false,
                  'message' => 'You are not authorized to mark this message as read'
                ], 403);
            }
            $message->update(['read_at' => now()]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read'
        ]);
    }

    public function getUnreadCount(Request $request)
    {
        $request->validate([
           'role' =>'required|in:tuteur,etudiant'
        ]);

        if ($request->role === 'tuteur') {
            $count = Chat::where('tuteur_id', Auth::id())
                         ->where('sender_type', 'etudiant')
                         ->whereNull('read_at')
                         ->count();
        } else if ($request->role === 'etudiant') {
            $count = Chat::where('etudiant_id', Auth::id())
                         ->where('sender_type', 'tuteur')
                         ->whereNull('read_at')
                         ->count();
        } else {
            return response()->json([
               'success' => false,
               'message' => 'Invalid sender type'
            ], 400);
        }


        return response()->json([
            'success' => true,
            'unread_count' => $count
        ]);
    }

public function getContacts($role)
{
    // $request->validate([
    //     'role' => 'required|in:tuteur,etudiant',
    //     'user_id' => 'required'
    // ]);

    if ($role === 'tuteur') {
        // Get all students enrolled in tutor's courses
        $contacts = CoursSubscriptions::where('tuteur_id', Auth::id())
            ->with(['etudiant' => function($query) {
                $query->select('id', 'fullname', 'email', 'image');
            }])
            ->select('etudiant_id')
            ->distinct()
            ->get()
            ->pluck('etudiant');

        return response()->json([
            'success' => true,
            'contacts' => $contacts
        ]);

    } else if ($role === 'etudiant') {
        // Get all tutors the student is subscribed to
        $contacts = CoursSubscriptions::where('etudiant_id', Auth::id())
            ->with(['tuteur' => function($query) {
                $query->select('id', 'fullname', 'email', 'image');
            }])
            ->select('tuteur_id')
            ->distinct()
            ->get()
            ->pluck('tuteur');

        return response()->json([
            'success' => true,
            'contacts' => $contacts
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Invalid role specified'
    ], 400);
}
}