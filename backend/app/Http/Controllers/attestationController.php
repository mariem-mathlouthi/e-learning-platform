<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attestation;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\AttestationMail;
use App\Models\Etudiant;


class attestationController extends Controller
{
    //
    public function addAttestation(Request $request){
        $requestData = $request->all();
    
        // Get the uploaded file
        $attestation = $request->file('attestation');
    
        // Generate a unique filename
        $filename = time().'_'.$attestation->getClientOriginalName();
    
        // Move the uploaded file to the uploads folder
        $attestation->move(public_path('storage/uploads'), $filename);

        // Store the file path instead of URL
        $filePath = 'storage/uploads/'.$filename;
    
        // Create a new Demande instance
        $new = new Attestation();
        $new->idEtudiant = $requestData['idEtudiant'];
        $new->idEntreprise = $requestData['idEntreprise'];
        $new->idOffreDeStage = $requestData['idOffreDeStage'];
        $new->attestation = $filePath; // Save the file path in the database
        $new->message = $requestData['message'];
        $new->date = date('Y-m-d', strtotime($requestData['date']));
        $new->save();

        // Get student email
        $student = Etudiant::find($requestData['idEtudiant']);
        if ($student) {
            // Send email with download link
            Mail::to($student->email)->send(new AttestationMail($new));
        }

        return response()->json([
            'message' => 'attestation Added successfully and email sent',
            'check' => true,
        ]);
    }

    public function getAttestationByEtudiant_Offer($idEtudiant)
    {
        $attestation = Attestation::where('idEtudiant', $idEtudiant)->get();

        if ($attestation->isEmpty()) {
            return response()->json([
                'message' => 'Attestation does not exist',
                'check' => false,
            ]);
        }

        return response()->json([
            'attestation' => $attestation,
            'message' => 'Attestation fetched successfully',
            'check' => true,
        ]);
    }

    public function downloadAttestation($id)
    {
        $attestation = Attestation::findOrFail($id);
        $filePath = public_path($attestation->attestation);

        if (!file_exists($filePath)) {
            return response()->json([
                'message' => 'File not found',
                'check' => false,
            ], 404);
        }

        // Get original filename from the path
        $originalName = basename($attestation->attestation);
        
        // Set headers to force download
        return response()->download($filePath, $originalName, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $originalName . '"',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache'
        ]);
    }


}
