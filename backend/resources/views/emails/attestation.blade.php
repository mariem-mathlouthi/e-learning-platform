<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Téléchargement d'Attestation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h2>Votre Attestation est Prête</h2>
    
    <p>Bonjour,</p>
    
    <p>Votre attestation est maintenant disponible au téléchargement. Veuillez cliquer sur le bouton ci-dessous pour accéder à votre document :</p>
    
    <a href="{{ url($attestation->attestation) }}" class="button" download>Télécharger l'Attestation</a>
    
    <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
    <p>{{ url($attestation->attestation) }}</p>
    
    <div class="footer">
        <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
        <p>Si vous avez des questions, veuillez contacter notre équipe de support.</p>
    </div>
</body>
</html>