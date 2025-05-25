<?php

namespace App\Http\Controllers;

use App\Mail\RecuMail;
use App\Models\Cours;
use App\Models\CoursSubscriptions;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Mail;

class CoursController extends Controller
{
    /**
     * Récupérer tous les cours.
     */
    public function getAllCourses()
    {
        $cours = Cours::with(['category', 'tuteur', 'apprenant', 'createur', 'subscriptions'])->get();
        return response()->json([
            'success' => true,
            'cours' => $cours
        ], 200);
    }

    public function getAverageFeedback($courseId)
    {
        try {
            $cours = Cours::with('feedbacks')->findOrFail($courseId);
            $feedbacks = $cours->feedbacks;

            if ($feedbacks->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No feedbacks available for this course'
                ], 404);
            }

            $sumOfNotes = $feedbacks->sum('note'); // Assuming 'note' is the column name for feedback score
            $numberOfFeedbacks = $feedbacks->count();
            $average = $sumOfNotes / $numberOfFeedbacks;

            return response()->json([
                'success' => true,
                'average_feedback' => $average
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }
    }

    public function getAllCoursesByTuteur(Request $request)
    {
        // Récupérer l'ID du tuteur depuis la requête
        $tuteurId = $request->query('tuteurId');

        // Vérifier si l'ID du tuteur est fourni
        if (!$tuteurId) {
            return response()->json([
                'success' => false,
                'message' => 'ID du tuteur manquant'
            ], 400);
        }

        // Filtrer les cours en fonction de l'ID du tuteur
        $cours = Cours::with(['category', 'tuteur', 'apprenant', 'createur'])
                      ->where('idTuteur', $tuteurId)
                      ->get();

        return response()->json([
            'success' => true,
            'cours' => $cours
        ], 200);
    }


    /**
     * Ajouter un nouveau cours.
     */
    public function createCourse(Request $request)
{
    try {
        // Récupérer toutes les données envoyées
        $requestData = $request->all();

        // Vérifier si un fichier est envoyé
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/cours'), $filename);
            $requestData['file'] = asset('storage/cours/' . $filename); // Stocker le chemin du fichier
        }

        // Créer un nouveau cours sans validation obligatoire
        $cours = new Cours();
        $cours->titre = $requestData['titre'] ?? null;
        $cours->description = $requestData['description'] ?? null;
        $cours->category_id = $requestData['category_id'] ?? null;
        $cours->prix = $requestData['prix'] ?? null;
        $cours->idTuteur = $requestData['idTuteur'] ?? null; // Optionnel
        $cours->idApprenant = $requestData['idApprenant'] ?? null; // Optionnel
        $cours->duration = $requestData['duration'] ?? null;
        $cours->file = $requestData['file'] ?? null;
        $cours->createdBy = $requestData['createdBy'] ?? null; // Optionnel

        // Sauvegarde dans la base de données
        $cours->save();

        return response()->json([
            'success' => true,
            'message' => 'Cours ajouté avec succès',
            'cours' => $cours
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'ajout du cours',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Récupérer un cours par son ID.
     */
    public function getCourseById($id)
    {
        try {
            $cours = Cours::with(['category', 'tuteur', 'apprenant', 'createur'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'cours' => $cours
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }
    }

    /**
     * Mettre à jour un cours.
     */
    public function updateCourse(Request $request, $id)
    {
        try {
            $cours = Cours::findOrFail($id);

            $request->validate([
                'titre' => 'sometimes|string|max:255',
                'description' => 'sometimes',
                'category_id' => 'sometimes|exists:categories,id',
                'prix' => 'sometimes|numeric',
                'idTuteur' => 'sometimes|exists:tuteurs,id',
                'idApprenant' => 'nullable|exists:etudiants,id',
                'duration' => 'sometimes|integer',
                'file' => 'nullable|string',
                'createdBy' => 'sometimes|exists:tuteurs,id',
            ]);

            $cours->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cours mis à jour avec succès',
                'cours' => $cours
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }
    }

    /**
     * Supprimer un cours.
     */
    public function deleteCourse($id)
    {
        try {
            $cours = Cours::findOrFail($id);
            $cours->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cours supprimé avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }
    }

    public function subscribeToCourse(Request $request)
    {
        $request->validate([
            'cours_id' => 'required|exists:cours,id',
            'etudiant_id' => 'required|exists:etudiants,id',
            'tuteur_id' => 'required|exists:tuteurs,id',

            'name' =>'required|string',
            'email' => 'required|email',
            'amount' =>'required|string',
            'payment_method' =>'required|string',
            'service_fee' => 'required|numeric',
            'address' =>'required|string',
            'postal_code' =>'required|string',
            'country' =>'required|string',
            'total' => 'required|string',
        ]);

        try {
            $subscription = CoursSubscriptions::create([
                'cours_id' => $request->cours_id,
                'etudiant_id' => $request->etudiant_id,
                'tuteur_id' => $request->tuteur_id
            ]);
            Mail::to($request->email)->send(new RecuMail(
                $request->name,
                $request->amount,
                $request->payment_method, 
                $request->service_fee, 
                $request->total, 
                $request->address,
                $request->postal_code, 
                $request->country));
            
            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'subscription' => $subscription
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}