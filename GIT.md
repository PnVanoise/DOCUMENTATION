**Sur serveur local**
- Créer un répertoire pour envoyer et recevoir les fichiers vers/de Github
- Aller dans le répertoire
- Initialiser le répertoire ``` $ git init ```
- Créer un lien avec le repository sur Github ``` $ git remote add nom_lien url_repository_github ``` Généralement origin est utilisé pour nom_lien
- Mettre la liaison en place  ``` $ git pull url_repository_github ```
- Préparer un/des fichiers(s) pour envoi sur Github ``` $ git add nom_fichier ``` ou . pour tous les fichiers et répertoires
- Commiter les fichiers ``` $ git commit -m 'description commit' ```
- Envoyer commit sur Github avec le lien créé sur la branche choisie ``` $ git push nom_lien nom_branche ``` Généralement origin master

- Supprmimer un fichier sur dépôt local et sur Github ``` $ git rm nom_fichier ``` puis faire un commit et un push
- Pour effacer les fichiers en attente de commit dans git add ``` $ git reset ```

- Suppression de branches merged suite à une pull request ``` $ git branch -d nom_branch_a_suppr ```
