
const grille = document.getElementById("recipe-grid");
const favorisGrille = document.getElementById("favorite-grid");
const recherche = document.getElementById("search");
const compteur = document.getElementById("recipe-count");

let filtreActuel = "Toutes";

let favoris = JSON.parse(
    localStorage.getItem("maCuisineFavoris") || "[]"
);

function afficherRecettes(liste, destination) {

    destination.innerHTML = "";

    if (liste.length === 0) {
        destination.innerHTML =
            '<p class="empty-message">Aucune recette trouvée.</p>';
        return;
    }

    liste.forEach(recette => {

        const carte = document.createElement("article");
        carte.className = "recipe-card";

        const image = document.createElement("img");
        image.src = recette.image;
        image.alt = recette.nom;
        image.loading = "lazy";

        image.onerror = () => {
            image.src = "images/recettes/default.jpg";
        };

        const contenu = document.createElement("div");
        contenu.className = "recipe-info";

        const titre = document.createElement("h3");
        titre.textContent = recette.nom;

        const description = document.createElement("p");
        description.textContent = recette.description;

        const categorie = document.createElement("div");
        categorie.className = "recipe-meta";
        categorie.textContent =
            recette.cuisine + " · " + recette.type;

        const bouton = document.createElement("button");
        bouton.className = "favorite-button";

        bouton.textContent = favoris.includes(recette.id)
            ? "♥ Dans mes favoris"
            : "♡ Ajouter aux favoris";

        bouton.addEventListener("click", () => {
            modifierFavoris(recette.id);
        });

        contenu.append(
            titre,
            description,
            categorie,
            bouton
        );

        carte.append(image, contenu);
        destination.appendChild(carte);
    });
}

function afficherCatalogue() {

    const mot = recherche.value
        .toLowerCase()
        .trim();

    const resultat = recettes.filter(recette => {

        const correspondFiltre =
            filtreActuel === "Toutes" ||
            recette.cuisine === filtreActuel ||
            recette.type === filtreActuel;

        const texte = [
            recette.nom,
            recette.cuisine,
            recette.type,
            recette.description,
            ...recette.ingredients
        ].join(" ").toLowerCase();

        return correspondFiltre && texte.includes(mot);
    });

    compteur.textContent =
        resultat.length + " recette(s)";

    afficherRecettes(resultat, grille);
}

function modifierFavoris(id) {

    if (favoris.includes(id)) {
        favoris = favoris.filter(item => item !== id);
    } else {
        favoris.push(id);
    }

    localStorage.setItem(
        "maCuisineFavoris",
        JSON.stringify(favoris)
    );

    afficherCatalogue();
    afficherFavoris();
}

function afficherFavoris() {

    const liste = recettes.filter(recette =>
        favoris.includes(recette.id)
    );

    afficherRecettes(liste, favorisGrille);
}

document.querySelectorAll(".filter").forEach(bouton => {

    bouton.addEventListener("click", () => {

        document.querySelectorAll(".filter")
            .forEach(item => item.classList.remove("active"));

        bouton.classList.add("active");

        filtreActuel = bouton.dataset.filter;

        afficherCatalogue();
    });
});

recherche.addEventListener(
    "input",
    afficherCatalogue
);

afficherCatalogue();
afficherFavoris();

