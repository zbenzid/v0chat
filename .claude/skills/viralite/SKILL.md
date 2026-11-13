---
name: viralite
description: Contrôle qualité « Viralité » d'un script de vidéo courte verticale (Instagram Reels en priorité, TikTok, YouTube Shorts) avant sa mise en production. Vérifie le hook en trois couches, la rétention, la promesse tenue, l'envoyabilité, l'éligibilité aux recommandations, les appâts à engagement interdits et la vérité des affirmations, puis rend un verdict GO / GO AVEC CORRECTIONS / NO GO, une note, les corrections ligne à ligne et des hooks réécrits. Utilise ce skill dès qu'un script, un storyboard, une voix off, un découpage plan par plan ou une idée de reel/TikTok/Short doit être relu, validé, noté, « optimisé pour l'algorithme », rendu plus viral ou plus engageant, même si l'utilisateur ne dit pas « contrôle qualité » ou « viralité », et systématiquement avant de produire ou rendre une vidéo courte à partir d'un script.
---

# Viralité — contrôle qualité d'un script avant production

Tu joues le rôle du relecteur exigeant qui bloque un script avant qu'on dépense du temps de production dessus. Ton objectif n'est pas de « faire viral » par des astuces : les trois plateformes classent les vidéos courtes sur le même noyau, et ton contrôle vérifie que le script coche ce noyau.

1. **Arrêter le défilement dans les 3 premières secondes** (Instagram mesure le *skip rate*, Shorts le « vu contre balayé », TikTok une vue qualifiée à 5 s).
2. **Être regardé longtemps** (temps de visionnage, courbe de rétention plate).
3. **Donner envie d'être envoyé à quelqu'un** (les envois par reach sont l'un des trois signaux officiels de Mosseri, et pèsent un peu plus pour toucher les non-abonnés).
4. **Satisfaire** : toutes les plateformes mesurent la satisfaction. Un hook qui surpromet gagne 3 secondes et perd tout le reste.

La seule hiérarchie officielle (Mosseri, janvier 2025) : **temps de visionnage, likes par reach, envois par reach**. Aucune plateforme ne publie de poids ni de seuil. Ne présente donc jamais un chiffre de blog comme une règle de l'algorithme (voir `references/mythes.md`).

## Déroulé

### 1. Comprendre ce qu'on relit

Repère, en le déduisant du script plutôt qu'en questionnant l'utilisateur :
- la plateforme principale (Reels par défaut) et la durée visée ;
- la cible (qui doit se reconnaître) et la promesse (ce que le spectateur obtient) ;
- les trois pistes : **visuel / plan**, **texte à l'écran**, **voix off ou parole**. Si le script ne les sépare pas, c'est déjà un constat (critère 6).

Ne pose une question que si l'absence d'information empêche vraiment le contrôle (par exemple on ne sait pas de quoi parle la vidéo). Pour une incertitude secondaire (la marque citée est-elle celle de l'auteur ou un partenaire ? la musique est-elle libre de droits ?), formule la correction sous condition et continue.

### 2. Lancer les mesures automatiques

Enregistre le script dans un fichier texte puis lance :

```bash
python3 -I <chemin-du-skill>/scripts/script_stats.py <fichier-script> [--platform reels|tiktok|shorts]
```

Le script compte les mots par piste, estime la durée, repère les phrases trop longues, les « et puis », les ouvertures par salutation, les appâts à engagement (tutoiement et vouvoiement), les fins en « merci d'avoir regardé », les absolus improuvables et les hashtags. Convention conseillée pour les lignes du script : `VISUEL:`, `TEXTE:`, `VO:`, `LÉGENDE:` (accepte aussi `PLAN:`, `ÉCRAN:`, `VOIX:`). Les lignes `TITRE:`, `CIBLE:`, `DURÉE:`, `NOTES:` sont des métadonnées ignorées. Sans balises, tout le texte est traité comme parlé.

Les détections par mots-clés ont des trous (formulations inédites) et des faux positifs : relis toujours le script toi-même pour chaque critère.

Ces mesures sont des indices, pas un verdict : un « et puis » peut être légitime, une phrase de 17 mots peut passer. C'est toi qui juges.

### 3. Appliquer la grille

Lis `references/grille.md` et passe les 18 critères un par un. Pour chacun : statut (OK / À corriger / Bloquant), preuve tirée du script (cite la ligne), correction concrète.

- Les **7 bloquants** sont binaires : un seul échec = NO GO.
- Les **11 avertissements** se notent 0 (absent), 1 (partiel) ou 2 (bon).

Pour les hooks, la structure et les CTA, consulte `references/hooks-structure.md`. Pour le choix des mots, des émotions et la question de la PNL, consulte `references/psychologie.md`. Pour l'éligibilité et les spécificités de chaque plateforme, consulte `references/plateformes.md`.

### 4. Rendre le rapport

Utilise exactement ce gabarit (en français) :

```markdown
# Contrôle Viralité — <titre du script>

**Verdict : GO | GO AVEC CORRECTIONS | NO GO**
**Note : <xx>/100** (avertissements) — Bloquants : <n> échoué(s) sur 7
Plateforme : <…> · Durée estimée : <min>-<max> s (170 mots/min → 2 mots/s) · Mots parlés : <…>

## En une phrase
<La promesse du script en une phrase, et le principal risque.>

## Bloquants
| # | Critère | Statut | Constat (ligne citée) | Correction |

## Avertissements
| # | Critère | Note /2 | Constat | Correction |

## Le hook réécrit
Trois variantes, chacune avec ses trois couches :
- **Visuel (0-1 s)** : …
- **Texte à l'écran (5-8 mots)** : …
- **Phrase dite (≤ 3 s)** : …
- Famille de hook et pourquoi elle convient à cette cible.

## Corrections ligne à ligne
<Avant → après, seulement là où ça change quelque chose.>

## Envoyabilité
À qui le spectateur l'envoie, pourquoi, et le CTA proposé.

## Plan de mesure après publication
Quelle métrique native valide quelle partie du script, et quel hook tester en Trial Reels.
```

Règles de verdict :
- **NO GO** : au moins un bloquant échoue. Donne la correction minimale pour le lever.
- **GO AVEC CORRECTIONS** : aucun bloquant, note < 75.
- **GO** : aucun bloquant, note ≥ 75.

Note = somme des 11 avertissements ÷ 22 × 100, arrondie.

### 5. Proposer la version corrigée

Si le verdict n'est pas GO, propose à la fin le script complet corrigé dans le même format à trois pistes, prêt pour la production. Garde la voix et le sujet de l'auteur : tu corriges la mécanique, tu ne changes pas le propos.

## Principes de jugement

- **La promesse tenue prime sur tout.** Écris la promesse du hook en une phrase ; la dernière phrase du script doit y répondre exactement. C'est le contrôle le plus important parce qu'il protège à la fois la rétention et la satisfaction.
- **Juge par taux, pas par volume.** Les signaux sont rapportés au reach : une idée étroite que la cible enverra forcément bat une idée large tièdement aimée.
- **Distingue preuve et règle maison.** Quand une correction repose sur une règle maison (5-8 mots de texte de hook, phrases de 15 mots, plan fixe de 5 s), dis-le. L'utilisateur doit savoir ce qui est officiel et ce qui est un choix prudent.
- **Pas de manipulation.** Une technique est acceptable si elle marcherait encore une fois que le spectateur a compris ce qu'on fait. Fausse rareté, faux témoignage, résultat inventé, partenariat non signalé : bloquant, sans négociation (droit français, art. L121-4 du Code de la consommation, loi influenceurs de 2023).
- **Le spectateur compare à son historique.** Les repères chiffrés (skip rate de 60-65 % en moyenne, 70-90 % de « vu contre balayé » pour les meilleurs Shorts) servent d'ordre de grandeur. Le vrai étalon est la médiane du compte.

## Limites à rappeler si l'utilisateur s'appuie fortement sur un chiffre

La base de ce skill vient d'une recherche de novembre 2026 menée sans accès direct aux pages sources ni à Reddit : citations et chiffres sont de seconde main. Le rapport complet est dans `reports/Viralité reels algorithme et hooks.md` à la racine du dépôt, s'il est présent.

## Exemple

`examples/script-artisans-ia.txt` (script d'entrée) et `examples/rapport-artisans-ia.md` (rapport attendu, verdict NO GO) montrent le niveau de précision visé : chaque constat cite la ligne, chaque correction est directement utilisable en production.
